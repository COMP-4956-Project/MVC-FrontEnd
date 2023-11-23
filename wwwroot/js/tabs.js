import { lineMaker } from "./drag_drop.js";

$(document).ready(function () {
  let tabCounter = 1;

  // Switching between tabs
  $(document).on("click", ".tab", function () {
    let tabId = $(this).data("tab-id");
    $(".tab, .tab-content").removeClass("active"); // Remove 'active' class from all tabs and contents
    $(`.tab[data-tab-id="${tabId}"]`).addClass("active"); // Add 'active' class to clicked tab
    $(".tab-content").hide(); // Hide all tab contents
    $(`.tab-content[data-tab-id="${tabId}"]`).show(); // Show the clicked tab's content
  });

  // Closing tabs
  $(document).on("click", ".close-tab", function (e) {
    e.stopPropagation(); // Prevent triggering the tab switching
    let tabId = $(this).parent().data("tab-id");
    $(
      `.tab[data-tab-id="${tabId}"], .tab-content[data-tab-id="${tabId}"]`
    ).remove();

    // If the removed tab was active, activate the first tab
    if ($(".tab.active").length === 0 && $(".tab").length > 0) {
      let firstTabId = $(".tab").first().data("tab-id");
      $(`.tab[data-tab-id="${firstTabId}"]`).addClass("active");
      $(`.tab-content[data-tab-id="${firstTabId}"]`).show();
    }
  });

  $("#addTab").click(function () {
    tabCounter++;
    let tabId = "tab-" + tabCounter;
    let newTab = `<div class="tab" data-tab-id="${tabCounter}"><span class="tab-title">Tab ${tabCounter}</span><button class="close-tab">x</button></div>`;

    let newTabContent =
      `<div class="tab-content" id="${tabId}" data-tab-id="${tabCounter}" style="display: none;">` +
      `Content for Tab ${tabCounter}` +
      `</div>`;

    // Append the new tab and content
    $(".tab-headers").append(newTab);
    $(".tab-contents").append(newTabContent);

    // Activate the new tab
    $(".tab, .tab-content").removeClass("active");
    $(
      `.tab[data-tab-id="${tabCounter}"], .tab-content[data-tab-id="${tabCounter}"]`
    ).addClass("active");
    $(".tab-content").hide();
    $(`.tab-content[data-tab-id="${tabCounter}"]`).show();

    // Optionally call a function to handle the line making
    lineMaker && lineMaker(document.getElementById(tabId)); // Check if lineMaker exists before calling

    // Scroll the tab headers to the end to show the new tab
    $(".tab-headers").animate(
      {
        scrollLeft: $(".tab-headers")[0].scrollWidth,
      },
      500
    );
  });
});
