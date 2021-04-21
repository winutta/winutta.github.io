

function main(){


	// Do React stuff

	function App() {
		return(
			<React.Fragment>
				<div className = "wire header">
					<div className = "wire center-vert logo-self"></div>
					<div className = "menu-button center-vert">
						<div className = "menu-bar-1"></div>
						<div className = "menu-bar-2"></div>
					</div>
					<div className = "menu-background">
						<div className = "menu-links center-vert">
							<div className = "big-links">
								<div className = "big-link">Home</div>
								<div className = "big-link">Work</div>
								<div className = "big-link">Company</div>
								<div className = "big-link">Reels</div>
								<div className = "big-link">Connect</div>
							</div>
							<div className = "small-links">
								<div className = "small-link">Instagram</div>
								<div className = "small-link">Linkedin</div>
								<div className = "small-link">Facebook</div>
								<div className = "small-link">Github</div>
								<div className = "small-link">Shadertoy</div>
							</div>
						</div>
						<div className = "search-bar">
							Search
						</div>
					</div>
				</div>

				

				<div className = "wire content header-displace">
					<iframe className="background-video" loading="lazy" frameborder="0" allow="autoplay; fullscreen" src="https://player.vimeo.com/video/172195573?autoplay=1&amp;loop=1&amp;autopause=0&amp;background=1&amp;byline=0&amp;portrait=0&amp;muted=1" data-ready="true"></iframe>

					<div className = "darken fill "></div>
					<div className = "wire tagline">Art Love.</div>
					<div>
						<div className = "footer-link button-hover-1">Tour the Gallery</div>
						<div className = "underline underline-transition"></div>
					</div>
					<div className = "scroll-ind">SCROLL</div>
							
					
				</div>

				<div className = "content">
					<div className = "half-vert">
						<div className = "blurb-top-2">
							<div className = "blurb-title-2">GUIDING MANTRA</div>
							<div className = "blurb-p-2">We make beautiful and interactive visual websites, serving those who seek inspiration.</div>
						</div>
						<div className = "about-link button-hover-2">See what we are about.</div>
						<div className = "about-underline underline-transition"></div>
					</div>
					<div className = "half-vert hv-right">
						<div className = "snow photo-stage-2"></div>
						<div className = "reels-link button-hover-3">Try a Visual</div>
						<div className = "reels-underline underline-transition"></div>
					</div>
				</div>	


				<div className = "content">
					<div className = "left-section-3">
						<div className = "center-vert blurb-3">
							<div className = "blurb-title-3">WE FOCUS ON</div>
							<div className = "blurb-main-3">Thoughtful Design</div>
							<div className = "blurb-p-3">Thoughful design choices, that incorporate a rich experience and intuitive interface, are at the heart of our process.</div>
							<div className = "view-link button-hover-4">View our Designs</div>
							<div className = "view-underline underline-transition"></div>
						</div>

					</div>
					<div className = "right-section-3">
						<div className = "photo-stage-3">
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	ReactDOM.render(
		<App />,
		document.getElementById('root')
	);

	var stops = [0,window.innerHeight*1 -100 + 1,window.innerHeight*2 -200];
	console.log(stops);


	// document.addEventListener("mousewheel",(e) => e.preventDefault(), {passive: false});
	// document.addEventListener('DOMMouseScroll',(e) => e.preventDefault(),false);
	document.addEventListener("wheel",manageScroll, {passive: false});
	document.addEventListener("wheel",(e) => e.preventDefault(), {passive: false});
	// document.onwheel = manageScroll;

	window.onresize = resetStops;


	var menuButton = document.getElementsByClassName("menu-button")[0];
	var menuBar1 = document.getElementsByClassName("menu-bar-1")[0];
	var menuBar2 = document.getElementsByClassName("menu-bar-2")[0];
	var menuBackground = document.getElementsByClassName("menu-background")[0];


	menuButton.onclick = manageMenu;

	var menuOpen = false;

	

	function manageMenu(e) {
		if(menuOpen){
			menuOpen = false;
			menuBar1.classList.remove("menu-bar-1-transition");
			menuBar2.classList.remove("menu-bar-2-transition");
			menuBackground.classList.remove("menu-transition");
			//close menu
		} else {
			menuOpen = true;
			menuBar1.classList.add("menu-bar-1-transition");
			menuBar2.classList.add("menu-bar-2-transition");
			menuBackground.classList.add("menu-transition");
		}
	}

	var scrollOnResize;

	var previousScroll = 0;
	var currentScroll = 0;
	var pageIndex = 0;
	var scrolling = false;

	function resetStops(){
		stops = [0,window.innerHeight*1 -100,window.innerHeight*2 -200];

		clearInterval(scrollOnResize);
		scrollOnResize =  window.setTimeout(()=>{
			scrolling = true;
			scrollDown(pageIndex);
		},50);
	}

	



	function manageScroll(event){
		// console.log("try");
		// console.log(scrolling);
		if(scrolling){
			console.log("Don't scroll.", scrolling)
			// console.log("currently Scrolling");
			return false;
		} else {
			
			
			var sign = event.wheelDelta < 0 ? 1: -1;
			var newPageIndex = Math.max(Math.min((pageIndex + sign),2),0);
			// console.log(sign,pageIndex, newPageIndex);

			if(newPageIndex != pageIndex){
				console.log("Scroll.", scrolling);
				pageIndex = newPageIndex;
				scrolling = true;
				var target = stops[newPageIndex];
				scrollDown(newPageIndex);
				// console.log(event.wheelDelta);
			}else {
				console.log("Edge Hit.")
				// console.log("reseting from manage");
				// scrolling = false;
			}
		}

		// return
	}
	var setScrolling;


	function scrollDown(pageIndex) {
		// scrolling = true;
		// setTimeout(() => scrolling = false, 50);
		var d = new Date();
		var t1 = d.getTime();
		console.log(t1);

		$('html').animate({
            scrollTop: stops[pageIndex]+'px'
        },{
        	duration: 50,
        	easing:"swing",
        	complete: () => {
        		var d = new Date();
        		var t2 = d.getTime();
        		// scrolling = false;
        		console.log("completed animation that took: ", t2-t1, " milliseconds");

        	// console.log("reseting from scroll");
        	},
        });
  		// console.log(document.getElementsByTagName("html")[0]);
  		// console.log($('html')[0]);
  		// var stuff = document.getElementById("root");
  		// var stuff = document.getElementsByTagName("html")[0];
  		// var stuff = document.body;
  		var stuff = document.documentElement;
  		// console.log(stuff);
  		var currentScroll =  stuff.scrollTop; 
  		console.log(currentScroll+"px", stops[pageIndex]+'px');

		 // stuff.animate([
			// {scrollTop: currentScroll},
			// {scrollTop: stops[pageIndex]},
			// ],{
   //      	duration: 500,
   //      	iterations: 1
   //      });

  		// var anim = stuff.animate({scrollTop: ["100px","800px"]}, 1000);
  		// anim.play();

   		// stuff.animate([
   		//   { // from
   		//   	// scrollTop: "500px",
   		//     opacity: 0,
   		//     width: "10%",
   		//     color: "#fff"
   		//   },
   		//   { // to
   		//   	// scrollTop: "800px",
   		//   	width: "100%",
   		//     opacity: 1,
   		//     color: "#000"
   		//   }
   		// ], 2000);

		clearInterval(setScrolling);
        setScrolling = window.setTimeout(() => {
        	scrolling = false;
        },250);

		// document.body.animate({scrollTop: stops[1]+"px"},800);
		// console.log("scrolled Down",stops[1]+"px");
	}

	

	// var background_video = document.getElementsByClassName("background-video")[0];

	//TO-DO: transition darken from hidden to visible on background_video load
	//Also try to fade in video and darken div too

	// function manageScroll(event){
	// 	// console.log("try");
	// 	if(scrolling){
	// 		// console.log("currently Scrolling");
	// 		return false;
	// 	} else {
	// 		// console.log("trying to scroll");
	// 		// currentScroll = window.scrollY;
	// 		// var delta = (currentScroll-previousScroll);
	// 		var sign = event.wheelDelta > 0 ? 1: -1;

	// 		// pageIndex = (delta > 0 && Math.abs(delta)>0) ? Math.min((pageIndex + 1),2) : Math.max((pageIndex - 1),0);
	// 		// pageIndex = (delta > 0 && Math.abs(delta)>0) ? Math.min((pageIndex + 1),2) : Math.max((pageIndex - 1),0);
			
	// 		pageIndex = Math.max(Math.min((pageIndex + sign),2),0);

	// 		var target = stops[pageIndex];

	// 		// previousScroll = currentScroll;
	// 		// console.log(target);
	// 		console.log(event.wheelDelta);
	// 	}

	// 	scrollDown(pageIndex);

	// 	// return
	// }




}

main();
