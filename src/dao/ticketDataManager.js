import mongoose from 'mongoose';
import {lastModel, ticketsModel} from '../models/ticket.model.js';
import {Router} from 'express';
import { ObjectId } from 'mongodb';
import {config} from '../config/config.js'

const router = Router ()

mongoose.connect(config.MONGO_URL);

export class ticketsDataManager {  

async obtenerTicket (tid) 
{
  try {
    const ticketId = tid ;
    const validObjectId = ObjectId.isValid(ticketId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      console.error("Identificador de Ticket invalido");
      } else {
        const ticket = await ticketsModel.findOne({ _id: ticketId}).exec();
        if (ticket) {
          return (ticket);
        } else {
          console.error('Ticket no encontrado');
        }
      }
  } catch (error) {
    console.error(`Error en el servidor ${error}`);
  }
};

async obtenerCodigoMayor () 
{ 
      try  {  
          const serie = 'A'
          let highestCodeValue = 0
          let ultimoTicket = await lastModel.findOne({serie: serie})
          if (ultimoTicket) 
          {
            highestCodeValue = ultimoTicket.last
            ultimoTicket.last = highestCodeValue + 1
          } else { 
            ultimoTicket = new lastModel ({serie:serie, last: 1 })
          }
          await ultimoTicket.save ()
          return highestCodeValue;
          } 
      catch (error) 
          {
          console.error(`Error en el servidor ${error}`);
          }
};

async crearTicket (newticket) 
{
    try {
      const ticket = new ticketsModel({...newticket});
      await ticket.save();
    } catch (error) {
      console.error('*-* Error en el servidor*-*');
    }
  };
  
}

export default ticketsDataManager