export enum ViewState {
  LOGIN = "LOGIN",
  LOADING = "LOADING",
  GAME = "GAME"
}

export interface PredictionCell {
  [key: string]: "1" | "0";
}

export interface PredictionsMap {
  [mKey: string]: PredictionCell;
}

export interface RowInfo {
  mult: string;
  row: number;
}
