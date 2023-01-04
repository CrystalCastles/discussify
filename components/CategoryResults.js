function CategoryResults(props) {
  return (
    <div className={`flex justify-center  ${props.className}`}>
      {props.categories.items.map((category) => {
        return (
          <div className="p-1 max-w-[15rem]" onClick={props.onClick}>
            <img className="m-auto cursor-pointer max-w-[10rem]" src={category.type == "track" ? category.album.images[1]?.url : category.images[1]?.url} alt={category.name}/>
            <p className="text-center">{category.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryResults;
