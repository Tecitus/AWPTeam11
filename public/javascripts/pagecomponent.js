class PageComponent extends Component
{
    constructor()
    {
        super()
    }

    async replaceTarget(target)
    {
        this.rootElement = document.createElement("div");
        this.rootElement.className = "MainPage";

        var options = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var coords = await window[windowid].socket.ioreq.Request('request',{rgroup: 'geo', request: 'getGeolocations'});
        this.coords = coords;
        try{
            var currentposition = await new Promise((resolve, reject) => 
            {
                navigator.geolocation.getCurrentPosition(
                    (position) => 
                        resolve(position), 
                    (error)=> 
                        reject(error)
                );
            });
            var currentcoodinates = new google.maps.LatLng(currentposition.coords.latitude, currentposition.coords.longitude);
            options.center = currentcoodinates;
        }
        catch(e)
        {
            console.log(e);
            var currentcoodinates = new google.maps.LatLng(37.629458, 127.081546)
        }
        var mapdiv = this.rootElement.createElement("div");
        mapdiv.id = "map_canvas";
        var map = new google.maps.Map(mapdiv, options);
        this.map = map;
        let thisclass = this;
        google.maps.event.addListener(map, 'dblclick', async function(event) {
            await window[windowid].socket.ioreq.Request('request',{rgroup: 'geo', request: 'makeGeolocation', longitude: event.latLng.lng(), latitude: event.latLng.lat()});
            await thisclass.refresh();
        });
        this.markers = [];
        for(var i of coords)
        {
            let coord = i;
            let marker = new google.maps.Marker({position: new google.maps.LatLng(coord.latitude, coord.longitude), map});
            this.markers.push(marker);
            marker.addListener('click', async function() {
                let lat = coord.latitude;
                let lng = coord.longitude;
                map.setZoom(17);
                map.setCenter(marker.getPosition());
                let leftthread = new RightThreadMenuComponent(lat, lng);
                await leftthread.replaceTarget(document.getElementsByClassName("RightThreadMenu")[0]);
            });
        }
        target.replaceWith(this.rootElement);
    }

    async refresh()
    {
        var coords = await window[windowid].socket.ioreq.Request('request',{rgroup: 'geo', request: 'getGeolocations'});
        let map = this.map;
        for(let i = 0; i < this.markers.length; i ++)
        {
            let latlng = this.markers[i].getPosition();
            if(!_.some(coords, (d) => {
                if(d.longitude == latlng.lng() && d.latitude == latlng.lat())
                    return true;
                else
                    return false;
            }))
            {
                this.markers[i].setMap(null);
                this.markers.splice(i, 1);
                i--;
            }
        }

        for(let i of coords)
        {
            if(!_.some(this.coords, (d) => {
                if(d.longitude == i.longitude && d.latitude == i.latitude)
                    return true;
                else
                    return false;
            }))
            {
                let coord = i;
                let marker = new google.maps.Marker({position: new google.maps.LatLng(coord.latitude, coord.longitude), map});
                this.markers.push(marker);
                marker.addListener('click', async function() {
                    let lat = coord.latitude;
                    let lng = coord.longitude;
                    this.map.setZoom(17);
                    this.map.setCenter(marker.getPosition());
                    let leftthread = new RightThreadMenuComponent(lat, lng);
                    await leftthread.replaceTarget(document.getElementsByClassName("RightThreadMenu")[0]);
                });
            }
        }
    }
}

document.onloadevents.push(async ()=>{
    var pages = document.getElementsByTagName("pagecomponent");
    for(var page of pages)
    {
        await new PageComponent().replaceTarget(page);
    }
});