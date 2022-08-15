import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  RouterState,
} from "@angular/router";

import { EventService } from "../../core/services/event.service";

import { SIDEBAR_TYPE } from "../layouts.model";

@Component({
  selector: "app-vertical",
  templateUrl: "./vertical.component.html",
  styleUrls: ["./vertical.component.scss"],
})

/**
 * Vertical component
 */
export class VerticalComponent implements OnInit, AfterViewInit {
  isMap = false;
  isCondensed = false;
  sidebartype: string;

  constructor(private router: Router, private eventService: EventService) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        document.body.classList.remove("sidebar-enable");
      }
    });
  }

  ngOnInit() {
    if (this.router.url === "/map") {
      this.isMap = true;
    }

    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        if (val.url == "/map") {
          this.isMap = true;
        } else {
          this.isMap = false;
        }
        console.log(this.isMap);
      }
    });

    this.sidebartype = SIDEBAR_TYPE;
    // listen to event and change the layout, theme, etc
    this.eventService.subscribe("changeSidebartype", (layout) => {
      this.sidebartype = layout;
      this.changeSidebar(this.sidebartype);
    });

    this.changeSidebar(this.sidebartype);

    document.body.setAttribute("data-layout", "vertical");
  }

  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      ua
    );
  }

  ngAfterViewInit() {}

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle("right-bar-enabled");
  }

  changeSidebar(value) {
    switch (value) {
      case "light":
        document.body.setAttribute("data-sidebar", "light");
        document.body.setAttribute("data-topbar", "dark");
        document.body.removeAttribute("data-sidebar-size");
        document.body.removeAttribute("data-layout-size");
        document.body.removeAttribute("data-keep-enlarged");
        document.body.classList.remove("vertical-collpsed");
        document.body.removeAttribute("data-layout-scrollable");
        break;
      case "compact":
        document.body.setAttribute("data-sidebar-size", "small");
        document.body.setAttribute("data-sidebar", "dark");
        document.body.removeAttribute("data-topbar");
        document.body.removeAttribute("data-layout-size");
        document.body.removeAttribute("data-keep-enlarged");
        document.body.classList.remove("sidebar-enable");
        document.body.classList.remove("vertical-collpsed");
        document.body.removeAttribute("data-layout-scrollable");
        break;
      case "dark":
        document.body.setAttribute("data-sidebar", "dark");
        document.body.removeAttribute("data-topbar");
        document.body.removeAttribute("data-layout-size");
        document.body.removeAttribute("data-keep-enlarged");
        document.body.removeAttribute("data-sidebar-size");
        document.body.classList.remove("sidebar-enable");
        document.body.classList.remove("vertical-collpsed");
        document.body.removeAttribute("data-layout-scrollable");
        break;
      case "icon":
        document.body.classList.add("vertical-collpsed");
        document.body.setAttribute("data-sidebar", "dark");
        document.body.removeAttribute("data-layout-size");
        document.body.setAttribute("data-keep-enlarged", "true");
        document.body.removeAttribute("data-topbar");
        document.body.removeAttribute("data-layout-scrollable");
        break;
      case "colored":
        document.body.classList.remove("sidebar-enable");
        document.body.classList.remove("vertical-collpsed");
        document.body.setAttribute("data-sidebar", "colored");
        document.body.removeAttribute("data-layout-size");
        document.body.removeAttribute("data-keep-enlarged");
        document.body.removeAttribute("data-topbar");
        document.body.removeAttribute("data-layout-scrollable");
        document.body.removeAttribute("data-sidebar-size");
        break;
      default:
        document.body.setAttribute("data-sidebar", "dark");
        break;
    }
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    document.body.classList.toggle("sidebar-enable");
    document.body.classList.toggle("vertical-collpsed");

    if (window.screen.width <= 768) {
      document.body.classList.remove("vertical-collpsed");
    }
  }
  setPadding() {
    if (this.router.url==='/map') {
      return "0";
    }
    else if(this.router.url==='/accountManagement'){
      return '1rem 1rem';
    }
    else {
      return "3rem 1rem";
    }
  }
}
