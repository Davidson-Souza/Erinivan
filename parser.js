module.exports = 
{
    parseMessage: (message) =>
    {
        if(!message.startsWith("-")) return [false, false];
        const components = message.split(" ");
        const command    = components[0].replace("-", "");
        let args = Array();
        
        for(let i = 1; i<components.length; i++)
            args.push(components[i]);
        return {command, args};
    }
}
