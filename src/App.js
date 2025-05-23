/**
 * Author: Paul
 * Github: PaulleDemon
 */
import { useEffect, useRef, useState } from 'react'

import { LayoutFilled, ProductFilled, CloudUploadOutlined, DatabaseFilled, AlignLeftOutlined } from "@ant-design/icons"
// import { DndContext, useSensors, useSensor, PointerSensor, closestCorners, DragOverlay, rectIntersection } from '@dnd-kit/core'
// import { snapCenterToCursor } from '@dnd-kit/modifiers'

import Canvas from './canvas/canvas'
import Header from './components/header'
import Sidebar from './sidebar/sidebar'
import UploadsContainer from './sidebar/uploadsContainer'
import WidgetsContainer from './sidebar/widgetsContainer'

import { DragProvider } from './components/draggable/draggableContext'
import PluginsContainer from './sidebar/pluginsContainer'

import { FileUploadProvider, useFileUploadContext } from './contexts/fileUploadContext'
import TemplatesContainer from './sidebar/templatesContainer'
import FrameWorks from './constants/frameworks'

import CustomTkWidgets from './frameworks/customtk/sidebarWidgets'
import CustomTkPluginWidgets from './frameworks/customtk/sidebarPlugins'
import generateCustomTkCode from './frameworks/customtk/engine/code'

import TkinterWidgets from './frameworks/tkinter/sidebarWidgets'
import TkinterPluginWidgets from './frameworks/tkinter/sidebarPlugins'
import generateTkinterCode from './frameworks/tkinter/engine/code'

import TkMainWindow from './frameworks/tkinter/widgets/mainWindow' 
import CTkMainWindow from './frameworks/customtk/widgets/mainWindow' 
import TreeviewContainer from './sidebar/treeviewContainer'
import { WidgetContextProvider } from './canvas/context/widgetContext'
import { isChromium } from './utils/system'
import { Modal } from 'antd'


function App() {

	/**
	 * @type {Canvas | null>}
	*/
	const canvasRef = useRef() 

	const [projectName, setProjectName] = useState('untitled project')
	const [UIFramework, setUIFramework] = useState(FrameWorks.TKINTER)
	
	const [shownNotChromiumAlert, setShownNotChromiumAlert] = useState(false) // if the user isn't using a chromium based browser alerts the user

    // const [uploadedAssets, setUploadedAssets] = useState([]) //  a global storage for assets, since redux can't store files(serialize files)

	const [sidebarWidgets, setSidebarWidgets] = useState(TkinterWidgets || [])
	const [sidebarPlugins, setSidebarPlugins] = useState(TkinterPluginWidgets || [])

	const {uploadedAssets} = useFileUploadContext()

	// NOTE: the below reference is no longer required
	const [canvasWidgets, setCanvasWidgets] = useState([]) // contains the reference to the widgets inside the canvas

	useEffect(() => {

		if (!shownNotChromiumAlert){
			// this modal may rerender twice only in dev mode because of how react works
			isChromium().then((isChrome) => {

				if (!isChrome){
					Modal.warning({
						title: "Use Chromium browser",
						onOk: () => setShownNotChromiumAlert(true),
						content: (<span>We recommend using Chromium based browser such as Chrome, Brave, Edge etc for best results. 
									<br />
									Join us on 
									<a href="https://discord.gg/dHXjrrCA7G" target='_blank' rel='noreferrer noopener'> Discord</a> for help and updates</span>)
					})
				}
			})
		}
		setShownNotChromiumAlert(true)		

	}, [shownNotChromiumAlert])

	const sidebarTabs = [
		{
			name: "Widgets",
			icon: <LayoutFilled />,
			content: <WidgetsContainer sidebarContent={sidebarWidgets} onWidgetsUpdate={(widgets) => setSidebarWidgets(widgets)}/>
		},
		{
			name: "Plugins",
			icon: <ProductFilled />,
			content: <PluginsContainer sidebarContent={sidebarPlugins}/>
		},
		{
			name: "Tree view",
			icon: <AlignLeftOutlined />,
			content: <TreeviewContainer />
		},
		{
			name: "Uploads",
			icon: <CloudUploadOutlined />,
			content: <UploadsContainer />
		},
		{
			name: "Templates",
			icon: <DatabaseFilled  />,
			content: <TemplatesContainer />
		}
	]


	useEffect(() => {

		if (!canvasRef)
			return

		const canvasBoundingBox = canvasRef.current.getCanvasContainerBoundingRect()
		const canvasCenterX = (canvasBoundingBox.width - canvasBoundingBox.left) / 2
		const canvasCenterY = (canvasBoundingBox.height - canvasBoundingBox.top) / 2

		// console.log("position: ", TkMainWindow.)
		if (UIFramework === FrameWorks.TKINTER){

			const widgetCenterX = (TkMainWindow.initialSize.width - canvasBoundingBox.left) / 2
			const widgetCenterY = (TkMainWindow.initialSize.height - canvasBoundingBox.top) / 2

			canvasRef?.current?.createWidget(TkMainWindow, {x: canvasCenterX - widgetCenterX, y: canvasCenterY - widgetCenterY}, ({id, widgetRef}) => {
				
				// center the widget when adding to canvas
				if (!widgetRef.current){
					return
				}

				const widgetBoundingBox = widgetRef.current?.getBoundingRect()
				const widgetCenterX = (widgetBoundingBox.width - widgetBoundingBox.left) / 2
				const widgetCenterY = (widgetBoundingBox.height - widgetBoundingBox.top) / 2


				// widgetRef.current?.setPos(canvasCenterX-widgetCenterX, canvasCenterY-widgetCenterY)
			})

		}else if (UIFramework === FrameWorks.CUSTOMTK){

			const widgetCenterX = (TkMainWindow.initialSize.width - canvasBoundingBox.left) / 2
			const widgetCenterY = (TkMainWindow.initialSize.height - canvasBoundingBox.top) / 2


			canvasRef?.current?.createWidget(CTkMainWindow, {x: canvasCenterX - widgetCenterX, y: canvasCenterY - widgetCenterY}, ({id, widgetRef}) => {

				// center the widget when adding to canvas
				if (!widgetRef.current){
					return
				}

				const widgetBoundingBox = widgetRef.current?.getBoundingRect()
				const widgetCenterX = (widgetBoundingBox.width - widgetBoundingBox.left) / 2
				const widgetCenterY = (widgetBoundingBox.height - widgetBoundingBox.top) / 2


				// widgetRef.current?.setPos(canvasCenterX-widgetCenterX, canvasCenterY-widgetCenterY)
			})
		}


	}, [UIFramework, canvasRef])

	// const handleDragStart = (event) => {
	// 	console.log("Drag start: ", event)
	// 	const draggedItem = sidebarWidgets.find((item) => item.name === event.active.id)
	// 	setActiveSidebarWidget(draggedItem)

	// 	const activeItemElement = widgetOverlayRef.current

	// 	if (activeItemElement) {
	// 		const rect = activeItemElement.getBoundingClientRect()
			
	// 		// Store the initial position of the dragged element
	// 		setInitialPosition({
	// 			x: rect.left,
	// 			y: rect.top,
	// 		})
	// 	}
	// }

	// const handleDragMove = (event) => {

	// 	// console.log("drag move: ", event)
	// }

	// const handleDragEnd = (event) => {
	// 	// add items to canvas from sidebar

	// 	const {active, over, delta, activatorEvent} = event

	// 	const widgetItem = active.data.current?.title
	// 	const activeItemElement =  widgetOverlayRef.current


	// 	console.log("ended: ", activatorEvent.clientX, activatorEvent.clientY)
	// 	// console.log("over: ", active, over, activeItemElement)
	// 	if (over?.id !== "canvas-droppable" || !widgetItem) {
	// 		setDropAnimation({ duration: 250, easing: "ease" })
	// 		return
	// 	}
	// 	setDropAnimation(null)
	
	// 	 // Get widget dimensions (assuming you have a way to get these)
	// 	 const widgetWidth = activeItemElement.offsetWidth; // Adjust this based on how you get widget size
	// 	 const widgetHeight = activeItemElement.offsetHeight; // Adjust this based on how you get widget size
	   

	// 	const canvasContainerRect = canvasRef.current.getCanvasContainerBoundingRect()
	// 	const canvasTranslate = canvasRef.current.getCanvasTranslation()
	// 	const zoom = canvasRef.current.getZoom()

	// 	let finalPosition = {	
	// 		x: (initialPosition.x + delta.x - canvasContainerRect.x - canvasTranslate.x) / zoom - (widgetWidth / 2),
	// 		y: (initialPosition.y + delta.y - canvasContainerRect.y - canvasTranslate.y) / zoom - (widgetHeight / 2),
	// 	}


	// 	// find the center of the active widget then set the final position

	// 	// finalPosition = {
	// 	// 	finalPosition
	// 	// }

	// 	console.log("drop position: ", "delta: ", delta, "activator", finalPosition, canvasTranslate,)

	// 	canvasRef.current.addWidget(Widget, ({id, widgetRef}) => {
	// 		widgetRef.current.setPos(finalPosition.x, finalPosition.y)
	// 		// widgetRef.current.setPos(10, 10)
	// 	})

	// 	setActiveSidebarWidget(null)

	// }

	const handleWidgetAddedToCanvas = (widgets) => {
		setCanvasWidgets(widgets)
	}

	const handleCodeGen = () => {

		if (UIFramework === FrameWorks.TKINTER){
			generateTkinterCode(projectName, canvasRef.current.getWidgets() || [], canvasRef.current.widgetRefs || [], uploadedAssets)
		}
		else if (UIFramework === FrameWorks.CUSTOMTK){
			generateCustomTkCode(projectName, canvasRef.current.getWidgets() || [], canvasRef.current.widgetRefs || [], uploadedAssets)

		}
	}

	const handleFrameworkChange = (framework) => {

		if (framework === UIFramework) return

		// canvasRef?.current?.closeToolBar()
		canvasRef?.current?.clearSelections()
		canvasRef?.current?.clearCanvas()
		setUIFramework(framework)
		
		if (framework === FrameWorks.TKINTER){
			setSidebarPlugins(TkinterPluginWidgets)
			setSidebarWidgets(TkinterWidgets)


		}else if (framework === FrameWorks.CUSTOMTK){
			setSidebarPlugins(CustomTkPluginWidgets)
			setSidebarWidgets(CustomTkWidgets)
		}

	}

	return (
		<div className="tw-w-full tw-h-[100vh] tw-flex tw-flex-col tw-bg-primaryBg">
			<Header className="tw-h-[6vh]" onExportClick={handleCodeGen} 
					projectName={projectName} onProjectNameChange={setProjectName}
					framework={UIFramework} onFrameworkChange={handleFrameworkChange}/>
			
			{/* <Modal title={"FrameWork Change"} open={isModalOpen} onClose={handleCancel}
                    okText={"Yes"}
                    onOk={handleOk} okType={okButtonType} onCancel={handleCancel}>
                <p>Are you sure you want to change the framework? This will clear the canvas.</p>
            </Modal> */}
				

			<WidgetContextProvider>
				<DragProvider>
					<div className="tw-w-full tw-h-[94vh] tw-flex">
						<Sidebar tabs={sidebarTabs}/>
						
						{/* <ActiveWidgetProvider> */}
						<Canvas ref={canvasRef} widgets={canvasWidgets} 
								/>
						{/* </ActiveWidgetProvider> */}
					</div>
					{/* dragOverlay (dnd-kit) helps move items from one container to another */}
				</DragProvider>
			</WidgetContextProvider>
		</div>
	)
}

export default App;
