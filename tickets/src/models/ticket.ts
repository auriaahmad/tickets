import mongoose from 'mongoose';

// This plugin brings optimistic concurrency control to Mongoose documents by incrementing document version numbers on each save, and preventing previous versions of a document from being saved over the current version.
// https://www.npmjs.com/package/mongoose-update-if-current
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}
// The mongoose. model() function of the mongoose module is used to create a collection of a particular database of MongoDB.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// The versionKey is a property set on each document when first created by Mongoose. 
// https://mongoosejs.com/docs/3.2.x/docs/guide.html
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
// https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};


// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.
// https://mongoosejs.com/docs/models.html
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
