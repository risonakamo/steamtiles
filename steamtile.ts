import "./steamtile.less";

function main()
{
    document.head.insertAdjacentHTML("beforeend",
        `<link rel="stylesheet" href="${chrome.runtime.getURL("build/steamtile-build.css")}">`);

    var observer:MutationObserver=new MutationObserver(replaceImages);

    observer.observe(document.querySelector("#search_resultsRows")!,{
        childList:true
    });

    replaceImages();
}

// target all images on page and replaces with higher res images
function replaceImages():void
{
    var searchrows:NodeListOf<HTMLLinkElement>=document.querySelectorAll(".search_result_row");

    var rowImageElement:HTMLImageElement;
    var extractedId:string;
    for (var x=0,l=searchrows.length;x<l;x++)
    {
        rowImageElement=searchrows[x].firstElementChild!.firstElementChild as HTMLImageElement;
        extractedId=searchrows[x].href.replace(/.*\/(\d+)\/.*/,"$1");

        rowImageElement.src=`https://steamcdn-a.akamaihd.net/steam/apps/${extractedId}/header.jpg`;
        rowImageElement.srcset=rowImageElement.src;
    }
}

main();