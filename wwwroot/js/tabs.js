import { lineMaker } from "./drag_drop.js";

$(document).ready(function() {
    let tabCounter = 1;

    // Function to update the tab title
    function updateTabTitle(element, newTitle) {
        // Update the tab title text
        $(element).text(newTitle);
        // Exit edit mode
        $(element).removeAttr('contenteditable');
        // Focus out after setting text
        $(element).blur();
    }

    // Event delegation for dynamic elements (tabs)
    $(document).on('dblclick', '.tab-title', function() {
        // Make content editable on double click
        $(this).attr('contenteditable', 'true').focus();
    });

    $(document).on('keypress', '.tab-title', function(e) {
        // Check for Enter key
        if (e.which === 13) {
            e.preventDefault(); // Prevent the default Enter key behavior
            let newTitle = $(this).text().trim();
            updateTabTitle(this, newTitle);
        }
    });

    // Click event on tab changes the active tab
    $(document).on('click', '.tab', function() {
        let tabId = $(this).data('tab-id');
        $('.tab, .tab-content').removeClass('active');
        $(`.tab[data-tab-id="${tabId}"]`).addClass('active');
        $('.tab-content').hide();
        $(`.tab-content[data-tab-id="${tabId}"]`).show();
    });

    // Close tab event
    $(document).on('click', '.close-tab', function(e) {
        e.stopPropagation();
        let tabId = $(this).parent().data('tab-id');
        $(`.tab[data-tab-id="${tabId}"], .tab-content[data-tab-id="${tabId}"]`).remove();
        if ($('.tab.active').length === 0 && $('.tab').length > 0) {
            let firstTabId = $('.tab').first().data('tab-id');
            $(`.tab[data-tab-id="${firstTabId}"]`).addClass('active');
            $(`.tab-content[data-tab-id="${firstTabId}"]`).show();
        }
    });

    $('#addTab').click(function() {
        tabCounter++;
        let tabId = "tab-" + tabCounter;
        let newTab = `<div class="tab" data-tab-id="${tabCounter}">` +
                     `<span class="tab-title" ondblclick="this.contentEditable=true;">New Tab</span>` +
                     `<button class="close-tab">x</button>` +
                     `</div>`;
        let newTabContent = `<div class="tab-content" id="${tabId}" data-tab-id="${tabCounter}" style="display: none;">` +
                            `Content for New Tab` +
                            `</div>`;
    
        $('#addTab').before(newTab);
    
        $('.tab-contents').append(newTabContent);
        $('.tab, .tab-content').removeClass('active');
        $(`.tab[data-tab-id="${tabCounter}"], .tab-content[data-tab-id="${tabCounter}"]`).addClass('active');
        $('.tab-content').hide();
        $(`.tab-content[data-tab-id="${tabCounter}"]`).show();
        lineMaker && lineMaker(document.getElementById(tabId));
        $('.tab-headers').animate({ scrollLeft: $('.tab-headers').prop("scrollWidth") }, 500);
    
    });
});