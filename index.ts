import * as ac from 'ac-node-sdk'
import { Parser } from 'xml2js'
import * as fs from 'fs'

const parser = new Parser({explicitArray : false})

const read = async (path:string):Promise<string>=>{
    const content:any = await new Promise((ok,no)=>{
        fs.readFile(`${__dirname}/${path}`,(err,data)=>{
            if(err){
                no(err)
            }else{
                ok(data.toString())
            }
        })
    })
    return content;
}

const parse = async (content:string):Promise<any>=>{
    const result:any = await new Promise((ok,no)=>{
        parser.parseString(content,(err,result)=>{
            if(err){
                no(err)
            }else{
                ok(result)
            }
        })
    })
    return result;
}


const request = async ()=>{
    const content = await read("cloudservice-conf.xml")
    const config = await parse(content)   
    console.dir(config,{
        depth:8
    }) 
    const {developer,authentication,framework,service} = config.configuration
    ac.init(developer.id,service['major-domain'],authentication['access-key'],authentication['secret-key'],framework.router)
    const response = ac.sendToService(service.name, 1, 'method', { })
    console.log(response)
}

request()
