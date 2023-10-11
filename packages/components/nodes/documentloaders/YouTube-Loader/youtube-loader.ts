import { ICommonObject, INode, INodeData, INodeParams } from '../../../../src/Interface';
import { TextSplitter } from 'langchain/text_splitter';
import { YoutubeLoader } from 'langchain/document_loaders/web/youtubeloader';

class YoutubeDocumentLoaderNode implements INode {
    label: string = 'YouTube Loader';
    name: string = 'YoutubeDocumentLoader';
    version: number = 1.0;
    description: string = 'Load and process data from YouTube videos';
    type: string = 'DocumentLoader';
    icon: string = 'youtube-icon.svg';
    category: string = 'Document Loaders';
    baseClasses: string[] = ['DocumentLoader'];
    inputs: INodeParams[] = [
        {
            label: 'Video URL',
            name: 'videoUrl',
            type: 'string',
            required: true,
            description: 'URL of the YouTube video to process.'
        }
    ];
    
    async execute(nodeData: INodeData) {
        // Implementation for loading and processing YouTube videos using Langchain's YoutubeLoader
        const videoUrl = nodeData.inputs['videoUrl'];
        const youtubeLoader = new YoutubeLoader();
        const result = await youtubeLoader.load(videoUrl);
        
        return result;
    }
}

export default YoutubeDocumentLoaderNode;
