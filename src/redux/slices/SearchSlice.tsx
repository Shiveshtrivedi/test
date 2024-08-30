import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Store';
import { IProduct } from '../../utils/interface/Interface';

interface SearchState {
  searchTerm: string;
  searchResults: IProduct[];
}

const initialState: SearchState = {
  searchTerm: '',
  searchResults: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setSearchResults(state, action: PayloadAction<IProduct[]>) {
      state.searchResults = action.payload;
    },
    clearSearchResults(state) {
      state.searchTerm = '';
      state.searchResults = [];
    },
  },
});

export const { setSearchTerm, setSearchResults, clearSearchResults } =
  searchSlice.actions;

export const selectSearchTerm = (state: RootState) => state.search.searchTerm;
export const selectSearchResults = (state: RootState) =>
  state.search.searchResults;

export default searchSlice.reducer;
