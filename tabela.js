function toggleTable() {
    const table = document.getElementById("tableContainer");
    const linkTopo = document.getElementById("link-topo-container");
    
    if (table.style.display === "none" || table.style.display === "") {
        table.style.display = "block";
        linkTopo.style.display = "block";
    } else {
        table.style.display = "none";
        linkTopo.style.display = "none";
    }
}
