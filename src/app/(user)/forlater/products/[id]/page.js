export default async function Product( {params} ) {
    //await id from params object
const { id } = await params;
  return ((
    <h1>this is product:{id}</h1>
  ) 
  );
}
