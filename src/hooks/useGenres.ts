import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../api/genres';

export const useGenres = () =>
    useQuery(['genres'], () => fetchGenres().then(res => res.data));
