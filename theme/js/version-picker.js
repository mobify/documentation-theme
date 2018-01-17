function versionPicker(baseUrl, pathArray, changelogPath, currentVersion) {
    // remove version # from path and then create the path string
    var absoluteUrl = pathArray.split(',').slice(1).join('/');
    var versionsJsonUrl = baseUrl + 'versions.json';

    var $versionPickerButton = $('button#version-picker');
    var $versionPickerList = $('ul#version-picker-versions');
    var $versionPickerCaret = $('#version-picker-caret');

    var getVersionLabel = function(version, isLatest) {
        return isLatest ? 'v' + version + ' latest' : 'v' + version
    }

    $versionPickerButton.click(function() {
        $versionPickerButton.toggleClass('active');
        $versionPickerCaret.toggleClass('active');
        $versionPickerList.slideToggle(200);
    });

    $versionPickerList.click(function() {
        $versionPickerButton.click();
    });

    var createItem = function(label, link, isSelected) {
        var $item = $('<li class="c-version-picker__item">');
        var $link = $('<a class="c-version-picker__link">' + label + '</a>');
        if (isSelected) {
            $item.addClass('c--selected');
        } else {
            $link.attr('href', link);
        }

        $item.append($link);
        $versionPickerList.append($item);
    }

    $.get(versionsJsonUrl, function(versions) {
        var numDisplayVersions = versions.length > 10 ? 10 : versions.length
        for (var i = 0; i < numDisplayVersions; i++) {
            var version = versions[i];
            var isLatest = i === 0;
            var isSelected = version === currentVersion ||
                (isLatest && currentVersion === 'latest');
            var versionLabel = getVersionLabel(version, isLatest);
            createItem(versionLabel, baseUrl + version + '/' + absoluteUrl, isSelected);

            if (isSelected) {
                $versionPickerButton.text(getVersionLabel(version, isLatest))
            }

            if (isLatest) {
                $versionPickerButton.addClass('is--latest')
            }
        }

        if (versions.length > 10) {
            createItem('Older versions', baseUrl + changelogPath);
        }

        // If the selected version is older than the first 10, it won't be in the list
        // and our button label won't be setup
        if ($versionPickerButton.text().length < 1) {
            $versionPickerButton.text(getVersionLabel(currentVersion, false))
        }

        $versionPickerButton.show();
    });
}
