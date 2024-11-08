import ReactMarkdown from 'react-markdown';
import copy from "copy-to-clipboard";
import { Clipboard, Check } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useState, useEffect } from 'react';

interface IProps {
    content: string;
    animation: boolean;
}

export default function Markdown({ content, animation }: IProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [displayedText, setDisplayedText] = useState('');

    const handleCopy = (text: string, index: number) => {
        console.log('clicked')
        copy(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    }

    // useEffect(() => {
    //     console.log(displayedText)
    // }, [displayedText])

    useEffect(() => {
        if (animation) {
            let currentIndex = 0;
            let timeoutId: any;

            const streamText = () => {
                if (currentIndex < content.length) {
                    // Increased chunk size for faster typing
                    const chunkSize = Math.floor(Math.random() * 4) + 2; // Now 2-5 characters at once
                    const nextChunk = content.slice(currentIndex, currentIndex + chunkSize);

                    setDisplayedText(content.slice(0, currentIndex + chunkSize));
                    currentIndex += chunkSize;

                    // Reduced base timeout for faster typing
                    let timeout = Math.floor(Math.random() * 20) + 10; // Base timeout between 10ms and 30ms

                    // Shorter pauses for punctuation
                    if (nextChunk.includes('.') || nextChunk.includes('!') || nextChunk.includes('?')) {
                        timeout += Math.floor(Math.random() * 150) + 100; // Add 100-250ms for punctuation
                    } else if (nextChunk.includes(',') || nextChunk.includes(';')) {
                        timeout += Math.floor(Math.random() * 75) + 50; // Add 50-125ms for minor punctuation
                    }

                    // Reduced delay for word complexity
                    if (nextChunk.length > 5) {
                        timeout += nextChunk.length * 5; // Add 5ms per character for longer words
                    }

                    timeoutId = setTimeout(streamText, timeout);
                }
            };

            streamText();

            // Cleanup function
            return () => {
                clearTimeout(timeoutId);
            };
        } else {
            setDisplayedText(content)
        }

    }, [content]);

    return (
        <ReactMarkdown
            components={{
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <div className='w-full'>
                            <div className='flex w-full justify-between px-6 bg-white/5 p-2 rounded-t-md items-center'>
                                <div className='text-base !text-[#e06c75] '>
                                <div className='text-base !text-[#e06c75] '>
                                    {match[1]}
                                </div>
                                <CopyButton
                                    text={String(children).replace(/\n$/, '')}
                                    index={node!.position?.start.line || 0}
                                    onCopy={handleCopy}
                                    isCopied={copiedIndex === (node!.position?.start.line || 0)}
                                />
                            </div>
                            <SyntaxHighlighter
                                language={match[1]}
                                style={gruvboxDark}

                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                },
            }}
        >{displayedText}</ReactMarkdown>
    )
}

interface CopyButtonProps {
    text: string;
    index: number;
    onCopy: (text: string, index: number) => void;
    isCopied: boolean;
}

function CopyButton({ text, index, onCopy, isCopied }: CopyButtonProps) {
    return (
        <button
            onClick={() => onCopy(text, index)}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
            {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Clipboard className="w-4 h-4 text-white/60" />
            )}
        </button>
    );
}