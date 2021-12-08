import { Client, Collection } from "discord.js"

class NewClient extends Client {

  commands?: Collection<any, any>;

  constructor(args: any) {
    super(args);
    
  } 
}

export default NewClient;