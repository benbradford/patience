import {IViewModelData} from './ViewModelData'

export default interface IViewModelDataHolder {
    data(): Readonly<IViewModelData>;
}