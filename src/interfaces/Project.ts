import IBoardColumn from './BoardColumn';

export default interface Project {
  id?: string;
  name: string;
  description: string;
  responsible?: string;
  columns?: IBoardColumn[];
}
