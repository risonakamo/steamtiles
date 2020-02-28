document.head.insertAdjacentHTML("beforeend",`<link rel="stylesheet" href="${chrome.runtime.getURL("steamtile.css")}">`);

function replaceImages()
{
    var searchrows=document.querySelectorAll(".search_result_row");

    var currentElement;
    for (var x=0,l=searchrows.length;x<l;x++)
    {
        currentElement=searchrows[x].firstElementChild.firstElementChild;
        currentElement.src=`https://steamcdn-a.akamaihd.net/steam/apps/${searchrows[x].href.replace(/.*\/(\d+)\/.*/,"$1")}/header.jpg`;
        currentElement.srcset=currentElement.src;
    }
}

function attachButtons()
{
    var pagebuttons=document.querySelectorAll(".search_pagination_right a");
    for (var x=0,l=pagebuttons.length;x<l;x++)
    {
        if (!pagebuttons[x].attached)
        {
            pagebuttons[x].addEventListener("click",(e)=>{
                replaceImages();
            });
        }
        pagebuttons[x].attached=1;
    }
}

function main()
{
    var observer=new MutationObserver(replaceImages);

    observer.observe(document.querySelector("#search_resultsRows"),{
        childList:true
    });

    replaceImages();
}

main();