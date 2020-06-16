export class ServerMessagesQueue{
    static to_send = [];

    static addToSendMessage(message){
        ServerMessagesQueue.to_send.push(message);
    }
}