import Tools from "../../../canvas/constants/tools"
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
            widgetName: "Frame",
            attrs: {
                ...this.state.attrs,
                padding: {
                    label: "padding",
                    padX: {
                        label: "Pad X",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 0, max: 140},
                        value: null,
                        onChange: (value) => {
                            // this.setWidgetInnerStyle("paddingLeft", `${value}px`)
                            // this.setWidgetInnerStyle("paddingRight", `${value}px`)

                            // const widgetStyle = {
                               
                            // }
                            this.setState((prevState) => ({

                                widgetInnerStyling: {
                                    ...prevState.widgetInnerStyling,
                                    paddingLeft: `${value}px`,
                                    paddingRight: `${value}px`
                                }
                            }))


                            this.setAttrValue("padding.padX", value)
                        }
                    },
                    padY: {
                        label: "Pad Y",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 0, max: 140},
                        value: null,
                        onChange: (value) => {

                            this.setState((prevState) => ({

                                widgetInnerStyling: {
                                    ...prevState.widgetInnerStyling,
                                    paddingTop: `${value}px`,
                                    paddingBottom: `${value}px`
                                }
                            }))
                            // this.setState({

                            //     widgetInnerStyling: widgetStyle
                            // })
                            this.setAttrValue("padding.padX", value)
                        }
                    },
                },
                margin: {
                    label: "Margin",
                    marginX: {
                        label: "Margin X",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 0, max: 140},
                        value: null,
                        onChange: (value) => {


                            this.updateState((prev) => ({
                                widgetOuterStyling: {
                                    ...prev.widgetOuterStyling,
                                    marginLeft: `${value}px`,
                                    marginRight: `${value}px`
                                },
                            }))
                            this.setAttrValue("margin.marginX", value)
                        }
                    },
                    marginY: {
                        label: "Margin Y",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 0, max: 140},
                        value: null,
                        onChange: (value) => {

                            this.updateState((prev) => ({
                                widgetOuterStyling: {
                                    ...prev.widgetOuterStyling,
                                    marginTop: `${value}px`,
                                    marginBottom: `${value}px`
                                },
                            }))

                            this.setAttrValue("margin.marginY", value)
                        }
                    },
                },  
            }
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
                `${variableName}.${this.getLayoutCode()}`,
                ...this.getGridLayoutConfigurationCode(variableName)
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