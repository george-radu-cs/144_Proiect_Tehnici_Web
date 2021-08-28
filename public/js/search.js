const showSearch = () => {
  let x = document.getElementById("dropdown-search");
  if (x.style.display === "none") {
    x.style.display = "flex";
    document.getElementById("label-search").setAttribute("for", "search-box");
  } else {
    x.style.display = "none";
  }
}
