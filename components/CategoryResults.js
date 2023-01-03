function CategoryResults(props) {
  return (
    <div className={props.className}>
      {props.categories.items.map((category) => {
        return (
          <>
            <img src={category.type == "track" ? category.album.images[1]?.url : category.images[1]?.url} alt={category.name}/>
            <p className="">{category.name}</p>
          </>
        );
      })}
    </div>
  );
}

export default CategoryResults;
