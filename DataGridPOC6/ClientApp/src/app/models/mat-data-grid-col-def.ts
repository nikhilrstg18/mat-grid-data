export class MatDataGridColDef {
    field: string;
    fieldHeader: string;
    cell: Function;
    width: string;
    isSortable: boolean

    constructor(
        _field: string, 
        _fieldHeader: string, 
        _cell: Function,
        _width: string, 
        _isSortable: boolean
    ) {
        this.field = _field,
        this.fieldHeader = _fieldHeader,
        this.cell = _cell
        this.width = _width
        this.isSortable = _isSortable
    }
}