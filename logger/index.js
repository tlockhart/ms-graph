/**
 * @file Initialize the log transports (targets to store logs) depending on configurations
 * Following three transports are supported and corresponding configuration to enable or disable
 * 1. MongoDB database (logger.logInDatabase)
 * 2. File (logger.logInFile)
 * 3. Console/Terminal (logger.logOnConsole)
 */

//  const config = require('config')
 const winston = require('winston')
 
 const transports = []
 const enumerateErrorFormat = winston.format(info => {
   if (info.level === 'error' && (info.meta || info.metadata)) {
     const err = (info.meta.err || info.meta.error)
     if (err instanceof Error) {
       info.meta.err = Object.assign({
         message: err.message,
         stack: err.stack,
         code: err.code
       }, err)
     }
   }
   return info
 })
 
 // Transport to display logs on console
 if (process.env.LOG_ON_CONSOLE) {
   transports.push(new (winston.transports.Console)({
     format: winston.format.combine(
       enumerateErrorFormat(),
       winston.format.json()
     ),
     level: process.env.LOGGER_LEVEL,
     handleExceptions: true
   }))
 }
 
 const logger = winston.createLogger({
   format: winston.format.metadata({ key: 'meta' }),
   transports: transports
 })
 logger.exitOnError = false
 
 module.exports = logger;
 console.log("LOGGER:", module.exports);
 