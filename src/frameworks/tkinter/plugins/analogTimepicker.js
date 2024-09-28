import React from "react"

import { timePicker } from 'analogue-time-picker'

import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { TkinterBase } from "../widgets/base"

import "./styles/timepickerStyle.css"


class AnalogTimePicker extends TkinterBase{

    static widgetType = "analogue_timepicker"

    static requiredImports = [
                                ...TkinterBase.requiredImports, 
                                'from tktimepicker import AnalogPicker, AnalogThemes'
                            ]
    
    static requirements = ["tkTimePicker"]

    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.timePicker = null

        this.timePickerRef = React.createRef()

        this.state = {
            ...this.state,
            size: { width: 'fit', height: 'fit' },
            attrs: {
                ...newAttrs,
                styling: {
                    theme:{
                        label: "Theme",
                        tool: Tools.SELECT_DROPDOWN, 
                        toolProps: {placeholder: "select theme"},
                        value: "",
                        options: ["Dracula", "Navy blue", "Purple"].map(val => ({value: val, label: val})),
                        onChange: (value) => this.handleThemeChange(value)
                    },
                    ...newAttrs.styling,
                    clockColor: {
                        label: "Clock Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#EEEEEE",
                        onChange: (value) => {
                            this.setAttrValue("styling.clockColor", value)
                        }
                    },
                    displayColor: {
                        label: "Display Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setAttrValue("styling.displayColor", value)
                        }
                    },
                    numberColor: {
                        label: "Numbers Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setAttrValue("styling.numberColor", value)
                        }
                    },
                    handleColor: {
                        label: "Handle Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000000c0",
                        onChange: (value) => {
                            this.setAttrValue("styling.handleColor", value)
                        }
                    },
                    
                },
                clockMode:{
                    label: "Clock Mode",
                    tool: Tools.SELECT_DROPDOWN, 
                    toolProps: {placeholder: "select mode", defaultValue: 12},
                    value: 12,
                    options: [12, 24].map(val => ({value: val, label: val})),
                    onChange: (value) => {
                        this.setAttrValue("clockMode", value)
                        if (value === 24){
                            // FIXME: the timepicker for 24 hrs also shows 12 hrs time
                            
                            this.timePicker.set24h()

                        }else{
                            this.timePicker.set12h()
                        }
                    }
                },

            }
        }

        this.handleThemeChange = this.handleThemeChange.bind(this)
    }

    componentDidMount(){
        super.componentDidMount()
        this.setWidgetName("Time picker")
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")

        this.timePicker = timePicker({
                                element: this.timePickerRef.current,
                                mode: "12"
                            })
        
        // used to remove ok and cancel buttons
        const timePickerBtns = this.timePickerRef.current.getElementsByClassName("atp-clock-btn")
        for (let i = 0; i < timePickerBtns.length; i++) {
            timePickerBtns[i].remove()
        }
    }

    componentWillUnmount(){
        this.timePicker.dispose()
    }

    handleThemeChange(value){
        this.setAttrValue("styling.theme", value)

        if (value === "Navy blue"){
            this.setAttrValue("styling.handleColor", "#009688")
            this.setAttrValue("styling.displayColor", "#009688")
            this.setAttrValue("styling.backgroundColor", "#fff")
            this.setAttrValue("styling.clockColor", "#EEEEEE")
            this.setAttrValue("styling.numberColor", "#000")
        }else if (value === "Dracula"){
            this.setAttrValue("styling.handleColor", "#863434")
            this.setAttrValue("styling.displayColor", "#404040")
            this.setAttrValue("styling.backgroundColor", "#404040")
            this.setAttrValue("styling.clockColor", "#363636")
            this.setAttrValue("styling.numberColor", "#fff")
        }else if (value === "Purple"){
            this.setAttrValue("styling.handleColor", "#EE333D")
            this.setAttrValue("styling.displayColor", "#71135C")
            this.setAttrValue("styling.backgroundColor", "#4E0D3A")
            this.setAttrValue("styling.clockColor", "#71135C")
            this.setAttrValue("styling.numberColor", "#fff")
        }

    }

    generateCode(variableName, parent){

        const theme = this.getAttrValue("styling.theme")

        const mode = this.getAttrValue("clockMode")
        const bgColor = this.getAttrValue("styling.backgroundColor")
        const clockColor = this.getAttrValue("styling.clockColor")
        const displayColor = this.getAttrValue("styling.displayColor")
        const numColor = this.getAttrValue("styling.numberColor")
        const handleColor = this.getAttrValue("styling.handleColor")

        const config = convertObjectToKeyValueString(this.getConfigCode())

        return [
                `${variableName} = AnalogPicker(master=${parent})`,
                `${variableName}.config(${config})`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()


        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    
    renderContent(){
        const timePickerStyling = { 
                '--bg': this.getAttrValue("styling.backgroundColor"), 
                '--clock-color': this.getAttrValue("styling.clockColor"), 
                '--number-color': this.getAttrValue("styling.numberColor"), 
                '--time-display': this.getAttrValue("styling.displayColor"), 
                '--main-handle-color': this.getAttrValue("styling.handleColor"), 
            }

        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start tw-pointer-events-none" 
                        style={timePickerStyling} 
                        ref={this.timePickerRef}>
                    
                </div>
            </div>
        )
    }

}


export default AnalogTimePicker