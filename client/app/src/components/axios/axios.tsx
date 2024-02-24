import axios from 'axios';
// 月が替わったら
/* 
    axios 
    TanStack Query(React Query)
    GETのときにuseQueryを、PUT・POST・DELETEのときにuseMutation

    Redux
 */
export const baseURL = 'http://localhost:3001'; // TODO: 本番環境では変更する localhost

/*
const UniversitiesPage= () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery(
    ["universitiesData", page],
    () => getUniversities(page),
  );
*/



