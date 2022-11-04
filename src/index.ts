import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session, { SessionOptions } from 'express-session';
import os from 'os';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import log from './logger';
import initWebRoutes from './routes';
import { startSocket } from './socket/idnex';
import compression from 'compression';
import { decode } from './utils';

dotenv.config();

process.env.UV_THREADPOOL_SIZE = os.cpus().length as unknown as string;

const app = express();
const PORT = process.env.PORT || 5000;
const URL_CLIENT = process.env.URL_CLIENT as string;
const SECRET = process.env.SECRET_SESSION as string;
const ENVIRONMENTS = process.env.NODE_ENV;

let options: SessionOptions = {
  secret: SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 3.154e10,
  },
};

// const storage = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
//     cb(null, 'src/assets/upload/');
//   },
//   filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
//     const ext = file.originalname.split('.');
//     const newExt = ext[ext.length - 1];
//     cb(null, `${Date.now()}.${newExt}`);
//   },
// });

// const upload = multer({ storage: storage });

// app.use(express.static(__dirname + '/assets/upload'));
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }

      return compression.filter(req, res);
    },
  })
);

app.use(
  cors({
    origin: URL_CLIENT,
    methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
    credentials: true,
    exposedHeaders: ['Set-cookie'],
    maxAge: 86400,
  })
);

app.use(cookieParser());

if (app.get('env') === 'production') {
  app.enable('trust proxy');
  options = {
    ...options,
    proxy: true,
    cookie: {
      ...options.cookie,
      secure: true,
      sameSite: 'none',
    },
  };
}

app.use(session(options));

app.use(bodyParser.json({ limit: '30mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
// app.use(upload.array('files'));

// app.post('/api/admin/upload', (req: Request, res: Response) => {
//   const tempFile = req.files;

//   if (tempFile && tempFile.length > 0) {
//     // @ts-ignore
//     res.json(req.files[0]);
//   }
// });

initWebRoutes(app);
connectDB();

const httpServer = app.listen(PORT, () => {
  log.info(`SERVER LISTEN ON http://localhost:${PORT}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: URL_CLIENT,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['X-Requested-With,content-type', 'Access-Control-Allow-Headers', '*'],
    credentials: true,
  },
});

// io.adapter();

io.use(async (socket, next) => {
  const token = socket.handshake.headers.authorization;

  const cutToken = token?.split('-->');

  if (cutToken && cutToken.length > 0) {
    try {
      const accessTokenClient = cutToken[0].split('Bearer ')[1];
      const accessTokenDashboard = cutToken[1].split('Bearer ')[1];

      const responseTokenClient = await decode(
        accessTokenClient,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string
      );

      const responseTokenDashboard = await decode(
        accessTokenDashboard,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string
      );

      console.log({ responseTokenClient, responseTokenDashboard });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') next(new Error(error.message));
      }
    }
  } else {
    next(new Error('Token Not Valid'));
  }
});

io.on('connection', (socket) => {
  startSocket(socket);
});
