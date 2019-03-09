"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _enums_1 = require("../common/@enums");
class CellEditor extends React.Component {
    constructor(props) {
        super(props);
        this.activeComposition = false;
        this.onEventInput = (eventName, e) => {
            const { setStoreState, dispatch, inlineEditingCell = {} } = this.props;
            switch (eventName) {
                case _enums_1.DataGridEnums.EventNames.BLUR:
                    setStoreState({
                        isInlineEditing: false,
                        inlineEditingCell: {},
                    });
                    dispatch(_enums_1.DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
                    break;
                case _enums_1.DataGridEnums.EventNames.KEYUP:
                    switch (e.which) {
                        case _enums_1.DataGridEnums.KeyCodes.ESC:
                            setStoreState({
                                isInlineEditing: false,
                                inlineEditingCell: {},
                            });
                            dispatch(_enums_1.DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
                            break;
                        case _enums_1.DataGridEnums.KeyCodes.UP_ARROW:
                        case _enums_1.DataGridEnums.KeyCodes.DOWN_ARROW:
                        case _enums_1.DataGridEnums.KeyCodes.ENTER:
                            if (!this.activeComposition) {
                                dispatch(_enums_1.DataGridEnums.DispatchTypes.UPDATE, {
                                    row: inlineEditingCell.rowIndex,
                                    colIndex: inlineEditingCell.colIndex,
                                    value: e.currentTarget.value,
                                    eventWhichKey: e.which,
                                });
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        };
        this.handleUpdateValue = (value, keepEditing) => {
            const { dispatch, li, col } = this.props;
            dispatch(_enums_1.DataGridEnums.DispatchTypes.UPDATE, {
                row: li,
                colIndex: col.colIndex,
                value: value,
                eventWhichKey: 'custom-editor-action',
                keepEditing,
            });
        };
        this.handleCancelEdit = () => {
            const { setStoreState, dispatch } = this.props;
            setStoreState({
                isInlineEditing: false,
                inlineEditingCell: {},
            });
            dispatch(_enums_1.DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
        };
        this.handleCustomEditorFocus = () => {
            const { setStoreState, li, col } = this.props;
            setStoreState({
                isInlineEditing: true,
                inlineEditingCell: {
                    rowIndex: li,
                    colIndex: col.colIndex,
                    editor: col.editor,
                },
            });
        };
        this.handleCustomEditorBlur = () => {
            const { setStoreState, dispatch } = this.props;
            setStoreState({
                isInlineEditing: false,
                inlineEditingCell: {},
            });
            dispatch(_enums_1.DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
        };
        this.renderInputText = (value) => {
            return (React.createElement("input", { type: "text", ref: this.inputTextRef, onCompositionUpdate: (e) => {
                    this.activeComposition = true;
                }, onCompositionEnd: (e) => {
                    setTimeout(() => {
                        this.activeComposition = false;
                    });
                }, onBlur: (e) => {
                    this.onEventInput(_enums_1.DataGridEnums.EventNames.BLUR, e);
                }, onKeyUp: (e) => {
                    this.onEventInput(_enums_1.DataGridEnums.EventNames.KEYUP, e);
                }, "data-inline-edit": true, defaultValue: value }));
        };
        this.inputTextRef = React.createRef();
        this.editorTargetRef = React.createRef();
    }
    componentDidMount() {
        if (this.inputTextRef.current) {
            this.activeComposition = false;
            this.inputTextRef.current.select();
        }
        // if (this.editorTargetRef.current) {
        //   const { data = [], col, li } = this.props;
        //   const value = data[li] && data[li][col.key || ''];
        //   const editor: IDataGrid.IColEditor =
        //     col.editor === 'text'
        //       ? { type: 'text' }
        //       : (col.editor as IDataGrid.IColEditor);
        //   if (editor && editor.render) {
        //     const element = editor.render({
        //       col: col,
        //       rowIndex: li,
        //       colIndex: col.colIndex || 0,
        //       value,
        //       update: this.handleUpdateValue,
        //       cancel: this.handleCancelEdit,
        //       focus: this.handleCustomEditorFocus,
        //       blur: this.handleCustomEditorBlur,
        //     });
        //     ReactDOM.render(element as any, this.editorTargetRef.current);
        //   }
        // }
    }
    componentDidUpdate(prevProps) {
        if (this.inputTextRef.current) {
            this.activeComposition = false;
            this.inputTextRef.current.select();
        }
    }
    shouldComponentUpdate(nextProps) {
        const { li, col: { colIndex }, } = nextProps;
        if (this.props.focusedRow === nextProps.focusedRow &&
            nextProps.focusedRow === li &&
            this.props.focusedCol === nextProps.focusedCol &&
            nextProps.focusedCol === colIndex) {
            return true;
        }
        return this.props.value !== nextProps.value;
    }
    render() {
        const { value, col, li } = this.props;
        // const value = data[li] && data[li][col.key || ''];
        const editor = col.editor === 'text'
            ? { type: 'text' }
            : col.editor;
        switch (editor.type) {
            case 'text':
                return this.renderInputText(value);
            default:
                if (!editor.render) {
                    return this.renderInputText(value);
                }
                // return <div ref={this.editorTargetRef} />;
                return editor.render({
                    col: col,
                    rowIndex: li,
                    colIndex: col.colIndex || 0,
                    value,
                    update: this.handleUpdateValue,
                    cancel: this.handleCancelEdit,
                    focus: this.handleCustomEditorFocus,
                    blur: this.handleCustomEditorBlur,
                });
        }
    }
}
exports.default = CellEditor;