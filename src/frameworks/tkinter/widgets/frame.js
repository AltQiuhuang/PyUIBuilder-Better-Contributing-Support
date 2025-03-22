import Widget from "../../../canvas/widgets/base"
import {TkinterBase} from "./base"


class Frame extends TkinterBase{

    static widgetType = "frame"
    static displayName = "Frame"

    constructor(props) {
        super(props)

        this.droppableTags = {
            exclude: ["image", "video", "media", "toplevel", "main_window"]
        }

        this.state = {
            ...this.state,
            fitContent: {width: true, height: true},
            widgetName: "Frame"
        }

    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#EDECEC")
    }

    generateCode(variableName, parent){

        const bg = this.getAttrValue("styling.backgroundColor")

        return [
                `${variableName} = tk.Frame(master=${parent})`,
                `${variableName}.config(bg="${bg}")`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    

    renderContent(){
        // console.log("bounding rect: ", this.getBoundingRect())

        // console.log("widget styling: ", this.state.widgetInnerStyling)
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-relative tw-rounded-md tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start" 
                    ref={this.styleAreaRef}
                    style={this.getInnerRenderStyling()}>
                    {this.props.children}
                </div>
            </div>
        )
    }

}


export default Frame