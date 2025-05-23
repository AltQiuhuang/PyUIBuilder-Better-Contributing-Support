import { memo, useEffect, useMemo, useRef, useState } from "react"
import Draggable from "./utils/draggableDnd"

import { Button } from "antd"
import { GithubOutlined, GitlabOutlined, LinkOutlined,
            AudioOutlined, FileTextOutlined,
            DeleteFilled,
            DeleteOutlined,
            GlobalOutlined, 
            EyeOutlined,
            EyeInvisibleOutlined} from "@ant-design/icons"

import DraggableWrapper from "./draggable/draggable"
import { useWidgetContext } from "../canvas/context/widgetContext"


export function SidebarWidgetCard({ name, img, url, license, widgetClass, innerRef}){

    const urlIcon = useMemo(() => {
        if (url){
            const host = new URL(url).hostname.toLowerCase()

            if (host === "github.com"){
                return <GithubOutlined />
            }else if(host === "gitlab.com"){
                return <GitlabOutlined />
            }else{
                return <GlobalOutlined />
            }
        }

    }, [url])


    return (
        // <Draggable className="tw-cursor-pointer" id={name}>
            <DraggableWrapper data-container={"sidebar"} 
                                dragElementType={widgetClass.widgetType} 
                                dragWidgetClass={widgetClass}
                                className="tw-cursor-pointer tw-w-fit tw-bg-white tw-h-fit">
                
                <div ref={innerRef} className="tw-select-none  tw-h-[200px] tw-w-[230px] tw-flex tw-flex-col 
                                                tw-rounded-md tw-overflow-hidden 
                                                tw-gap-2 tw-text-gray-600 tw-bg-[#ffffff44] tw-border-solid tw-border-[1px]
                                                tw-border-gray-500 tw-shadow-md">
                    <div className="tw-h-[200px] tw-pointer-events-none tw-w-full tw-overflow-hidden">
                        <img src={img} alt={name} className="tw-object-contain tw-h-full tw-w-full tw-select-none" />
                    </div>
                    <span className="tw-text-center tw-text-black tw-text-lg">{name}</span>
                    <div className="tw-flex tw-text-lg tw-place tw-px-4">

                        <a href={url} className="tw-text-gray-600" target="_blank" rel="noopener noreferrer">
                            {urlIcon}
                        </a>

                        {license?.name && 

                            <div className="tw-ml-auto tw-text-sm">
                                {
                                license.url ? 
                                    <a href={license.url} target="_blank" rel="noreferrer noopener"
                                        className="tw-p-[1px] tw-px-2 tw-text-blue-500 tw-border-[1px]
                                                                        tw-border-solid tw-rounded-sm tw-border-blue-500
                                                                        tw-shadow-md tw-text-center tw-no-underline">
                                        {license.name}
                                    </a>
                                    :
                                    <div className="tw-p-[1px] tw-px-2 tw-text-blue-500 tw-border-[1px]
                                                    tw-border-solid tw-rounded-sm tw-border-blue-500
                                                    tw-shadow-md tw-text-center">
                                        {license.name}
                                    </div>
                                }
                            </div>    
                        }
                    </div>
                    
                </div>
            </DraggableWrapper>
        // </Draggable> 
    )

}


export function DraggableAssetCard({file, onDelete}){

    const videoRef = useRef()

    useEffect(() => {

        function playOnMouseEnter(){
            videoRef.current.play()
        }

        function pauseOnMouseEnter(){
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }

        if (videoRef.current){
            videoRef.current.addEventListener("mouseenter", playOnMouseEnter)
            videoRef.current.addEventListener("mouseleave", pauseOnMouseEnter)
        }

        return () => {
            if (videoRef.current){
                videoRef.current.removeEventListener("mouseenter", playOnMouseEnter)
                videoRef.current.removeEventListener("mouseleave", pauseOnMouseEnter)
            }
        }

    }, [videoRef])


    return (
        <div draggable="false" className="tw-w-full tw-h-[220px] tw-flex-shrink-0 tw-p-1 tw-flex tw-flex-col tw-rounded-md tw-overflow-hidden 
                        tw-gap-2 tw-text-gray-600 tw-bg-[#ffffff44] tw-border-solid tw-border-[1px] 
                        tw-border-blue-500 tw-shadow-md ">
            <div className="tw-h-[200px] tw-pointer-events-none tw-w-full tw-flex tw-place-content-center tw-p-1 tw-text-3xl tw-overflow-hidden">
                { file.fileType === "image" &&
                    <img src={file.previewUrl} alt={file.name} className="tw-object-contain tw-h-full tw-w-full tw-select-none" />
                }

                {
                    file.fileType === "video" &&
                    <video className="tw-w-full tw-object-contain" ref={videoRef} muted>
                        <source src={file.previewUrl} type={`${file.type || "video/mp4"}`} />
                        Your browser does not support the video tag.
                    </video>
                }

                {
                    file.fileType === "audio" && 
                        <AudioOutlined />
                } 
                {
                    file.fileType === "others" && 
                        <FileTextOutlined />
                }

            </div>
            <div className="tw-flex tw-justify-between tw-gap-1 tw-p-1">
                <span onDragStart={() => false} draggable="false" 
                    className="tw-text-sm tw-text-back tw-pointer-events-none">{file.name}</span>

                <div className="tw-text-red-500 tw-cursor-pointer" 
                        onClick={() => onDelete(file)} >
                    <DeleteOutlined />
                </div>
            </div>
        </div>
    )

}


export const TreeViewCard = memo(({widgetRef, title, isTopLevel}) => {

    const [widgetVisible, setWidgetVisible] = useState(widgetRef.current.isWidgetVisible)
    const {activeWidget} = useWidgetContext()

    const onDelete = () => {
        widgetRef.current.deleteWidget()
    }

    const toggleHideShowWidget = () => {
        
        setWidgetVisible(!widgetRef.current.isWidgetVisible())

        if (widgetRef.current.isWidgetVisible())
            widgetRef.current.hideFromViewport()
        else{
            widgetRef.current.unHideFromViewport()
        }
    }

    const handleSingleClick = () => {
        activeWidget?.deSelect()
        widgetRef.current.select()
    }

    return (
        <div className="tw-flex tw-place-items-center tw-px-2 tw-p-1 tw-place-content-between 
                            tw-gap-4 tw-w-full" style={{width: "100%"}} 
                            onClick={handleSingleClick}
                            onDoubleClick={() => widgetRef?.current.panToWidget()}
                            >
            <div className={`tw-text-sm ${isTopLevel ? "tw-font-medium" : ""}`}>
                {title}
            </div>

            <div className="tw-ml-auto tw-flex tw-gap-1">
                <Button color="danger" title="delete" onClick={onDelete} size="small" variant="text" danger 
                icon={<DeleteOutlined />}></Button>
                <Button variant="text" type="text" title="hide" onClick={toggleHideShowWidget} size="small" 
                icon={widgetVisible ? <EyeOutlined /> : <EyeInvisibleOutlined/>}></Button>
            </div>
        </div>
    )
})