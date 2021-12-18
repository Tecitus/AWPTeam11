
class SocketIORequest
{
    constructor(id, timeout)
    {
        this.id = id;
        this.timeout = timeout;
        this.result;
        this.complete = false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class SocketIOPromise
{
    constructor(io, maxrequest = 2000, timeout = 5000)
    {
        this.io = io;
        this.maxRequest = maxrequest;
        this.timeout = timeout;
        this.reqHeader = 0;
        this.requests = Array(this.maxRequest);
        this.wrapper();
    }

    async wrapper()
    {
        await this.io.on('response', async (data) => 
        {
            this.requests[data.id].result = data.result;
            this.requests[data.id].complete = true;
        });
    }

    async Request(event, data)
    {
        while(this.requests[this.reqHeader])
        {
            this.reqHeader++;
            if(this.reqHeader >= this.maxRequest)
            {
                this.reqHeader = 0;
            }
        }
        var req = new SocketIORequest(this.reqHeader, Date.now() + this.timeout);
        this.requests[this.reqHeader] = req;
        if(typeof(data) == Object)
        {
            data.id = req.id;
        }
        else
        {
            data = {data: data, id: req.id, wasdata: true};
        }
        this.reqHeader++;
        if(this.reqHeader >= this.maxRequest)
        {
            this.reqHeader = 0;
        }
        await socket.emit(event, data);
        return new Promise(async (resolve, reject)=>
        {
            while((req.result || !req.complete)&& req.timeout > Date.now())
            {
                await sleep(10);
            }
            if(req.result)
            {
                resolve(req.result);
            }
            else
            {
                reject(req.id);
            }
            this.requests[req.id] = undefined;
        });
    }

    async Response(data, id = undefined)
    {
        if(!(id in data) && id)
        {
            data.id = id;
        }
        
        await this.io.emit('response', data);
    }
}