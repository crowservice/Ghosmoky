export default {
  name: "call",

  async load(entry, _, sock) {
    const { id, from, status } = entry[0];

    await sock.rejectCall(id, from);

    if (status === "terminate" && Math.random() < 0.1) {
      sock.sendMessage(from, {
        text: "Estas no son horas de llamar. Al meno' que me lo quiera' mamar.",
      });
    }
  },
};
