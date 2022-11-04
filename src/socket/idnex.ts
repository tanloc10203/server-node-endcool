import { Socket } from 'socket.io';

let users: Array<{ user_id: string }>;

const addUser = (socketId: string) => {
  if (socketId) {
    const data = {
      user_id: socketId,
    };

    users?.push(data);
  }
};

export function startSocket(socket: Socket) {
  console.log('Connect Socket', socket.id);

  // console.log(socket.handshake);

  socket.emit('join', { users });
}
