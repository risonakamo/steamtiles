import {DateTime} from "luxon";

import "./steamtile.less";

function main()
{
    document.head.insertAdjacentHTML("beforeend",
        `<link rel="stylesheet" href="${chrome.runtime.getURL("build/steamtile-build.css")}">`);

    var observer:MutationObserver=new MutationObserver(()=>{
        replaceImages();
        insertDateHeaders();
    });

    observer.observe(document.querySelector("#search_resultsRows")!,{
        childList:true
    });

    replaceImages();
    insertDateHeaders();
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

// target all tile elements and append day headers for each day
function insertDateHeaders():void
{
    var tileElements:HTMLLinkElement[]=Array.from(document.querySelectorAll(".search_result_row"));

    var tiles:DatedTile[]=tileElements.map((x:HTMLLinkElement)=>{
        return {
            tile:x,
            date:resolveDate((x.querySelector(".search_released")! as HTMLElement).innerText)
        };
    });

    // filter out tiles with invalid dates
    tiles=tiles.filter((x:DatedTile)=>{
        return x.date && x.date.isValid;
    });

    // reject all tiles where the previous date is the same as the current tile's date.
    tiles=tiles.filter((x:DatedTile,i:number)=>{
        // always take first tile
        if (i==0)
        {
            return true;
        }

        return !(x.date?.equals(tiles[i-1].date!));
    });

    // for (var x=0,l=tiles.length;x<l;x++)
    // {
    //     insertHeader(tiles[x].tile);
    // }

    console.log(tiles);
}

// given the date string of a tile, which is in a special format, attempt to create a DateTime from that string.
// if the string is invalid, or should be considered invalid, returns null.
function resolveDate(dateString:string):DateTime|null
{
    if (!/.* \d+, \d+/.test(dateString))
    {
        return null;
    }

    return DateTime.fromJSDate(new Date(dateString));
}

function insertHeader(targetTile:HTMLElement):void
{
    targetTile.insertAdjacentHTML("beforebegin",`<h1 class="day-header">HELLO</h1>`);
}

main();