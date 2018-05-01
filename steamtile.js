document.head.insertAdjacentHTML("beforeend",`<link rel="stylesheet" href="${chrome.runtime.getURL("steamtile.css")}">`);

var searchrows=document.querySelectorAll(".search_result_row");
for (var x=0,l=searchrows.length;x<l;x++)
{
    searchrows[x].firstElementChild.firstElementChild.src=`https://steamcdn-a.akamaihd.net/steam/apps/${searchrows[x].href.replace(/.*\/(\d+)\/.*/,"$1")}/header.jpg`;
}