import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface';
import { TextSplitter } from 'langchain/text_splitter';
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube';
import { getCredentialData, getCredentialParam } from '../../../src';

class Youtube_DocumentLoaders implements INode {
    label: string;
    name: string;
    version: number;
    description: string;
    type: string;
    icon: string;
    category: string;
    baseClasses: string[];
    credential: INodeParams;
    inputs: INodeParams[];

    constructor() {
        this.label = 'Youtube Loader';
        this.name = 'youtubeLoader';
        this.version = 1.0;
        this.type = 'Document';
        this.icon = 'youtube.png';
        this.category = 'Document Loaders';
        this.description = 'Load and process data from YouTube videos';
        this.baseClasses = [this.type];
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            optional: false,
            credentialNames: ['youtube']
        };
        this.inputs = [
            {
                label: 'Video ID',
                name: 'video_id',
                type: 'string'
            },
            {
                label: 'Text Splitter',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: 'Metadata',
                name: 'metadata',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ];
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter;
        const video_id = nodeData.inputs?.video_id as string;
        const metadata = nodeData.inputs?.metadata;

        const credentialData = await getCredentialData(nodeData.credential ?? '', options);
        const youtubeApiKey = getCredentialParam('youtubeApiKey', credentialData, nodeData);
        const loader = new YoutubeLoader({ video_id: video_id, apiKey: youtubeApiKey });
        const docs = textSplitter ? await loader.loadAndSplit() : await loader.load();

        if (metadata) {
            const parsedMetadata = typeof metadata === 'object' ? metadata : JSON.parse(metadata);
            return docs.map((doc) => {
                return {
                    ...doc,
                    metadata: {
                        ...doc.metadata,
                        ...parsedMetadata
                    }
                };
            });
        }

        return docs;
    }
}

module.exports = { nodeClass: Youtube_DocumentLoaders };
