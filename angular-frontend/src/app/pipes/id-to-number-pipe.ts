import {Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'idToNumber',
    standalone: true
})
export class IdToNumberPipe implements PipeTransform {
    transform (value : string) : number {
        return Number(value)
    }
}
