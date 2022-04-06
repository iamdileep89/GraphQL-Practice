import { parse, join} from 'path';
import { createWriteStream } from 'fs';
import stream from "stream";
import util from 'util'
import { URL } from '../../config';
import { GraphQLUpload } from 'graphql-upload';

const finished = util.promisify(stream.finished);

export default {
    Query: {
        info: () => "Hello I'm a Image Resolver Methods"
    },
    Upload: GraphQLUpload,
    Mutation: {
        imageUploader: async (parent, args, context, info) => {
            const { file } = args;
            let { createReadStream, filename, mimetype, encoding } = await file;
            
            // Invoking the `createReadStream` will return a Readable Stream.
            // See https://nodejs.org/api/stream.html#stream_readable_streams
            const stream = createReadStream();
            let { name, ext } = parse(filename);
            name = name.replace(/([^a-z0-9])/gi, "-").replace(" ","_");
            let serverFile = join(__dirname, `../../uploads/${name}-${Date.now()}${ext}`);
            let writeStream = await createWriteStream(serverFile);
            await stream.pipe(writeStream);
            await finished(writeStream);
            filename = `${URL}${serverFile.split('uploads')[1]}`;
        
            return { filename, mimetype, encoding };
        }
    }
}