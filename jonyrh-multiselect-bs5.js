/**
 * Jony Rh MultiSelect for Bootstrap 5.3 
 * Copyright (c) 2026, Jony Rh
 * http://www.jonyrh.ru 
 */

document.addEventListener('DOMContentLoaded', () => {
  const nativeSelects = document.querySelectorAll('select.bs-multiselect');

  nativeSelects.forEach(select => {
    select.classList.add('d-none');

    const isMultiple = select.hasAttribute('multiple');
    const placeholder = select.dataset.placeholder || (isMultiple ? 'Выберите элементы' : 'Выберите элемент');
    const maxItems = select.dataset.maxItems ? parseInt(select.dataset.maxItems, 10) : null;

    const showSearch = select.dataset.search !== 'false';
    const showActions = isMultiple && select.dataset.actions !== 'false';

    let sizeContainerClass = '';
    let btnSizeClass = '';

    if (select.classList.contains('form-select-sm') || select.classList.contains('form-control-sm')) {
      sizeContainerClass = 'bs-multiselect-sm';
      btnSizeClass = 'btn-sm';
    } else if (select.classList.contains('form-select-lg') || select.classList.contains('form-control-lg')) {
      sizeContainerClass = 'bs-multiselect-lg';
      btnSizeClass = 'btn-lg';
    }

    const classesToCopy = Array.from(select.classList)
      .filter(cls => !['form-select', 'bs-multiselect', 'd-none', 'form-select-sm', 'form-select-lg', 'form-control-sm', 'form-control-lg'].includes(cls))
      .join(' ');

    const isSelectDisabled = select.disabled ? 'disabled' : '';
    const initialInvalidState = select.classList.contains('is-invalid');
    const containerModeClass = isMultiple ? 'multiple-select' : 'single-select';

    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = `dropdown bs-multiselect-container ${containerModeClass} ${sizeContainerClass} ${classesToCopy}`;

    const inputName = `ms_group_${Math.floor(Math.random() * 100000)}`;
    const inputType = isMultiple ? 'checkbox' : 'radio';

    let optionsHtml = '';
    let optionIndex = 0;

    Array.from(select.childNodes).forEach(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      if (node.tagName === 'OPTGROUP') {
        optionsHtml += `<div class="multiselect-group-label">${node.label}</div>`;
        node.querySelectorAll('option').forEach(option => {
          optionsHtml += generateOptionHtml(option, optionIndex++);
        });
      } else if (node.tagName === 'OPTION') {
        optionsHtml += generateOptionHtml(node, optionIndex++);
      } else if (node.tagName === 'HR') {
        optionsHtml += `<hr class="multiselect-hr">`;
      }
    });

    function generateOptionHtml(option, index) {
      if (!isMultiple && option.value === '' && option.disabled) return '';

      const isChecked = option.selected ? 'checked' : '';
      const uniqueId = `ms_${select.name || 'chk'}_${index}_${Math.floor(Math.random() * 1000)}`;
      const optionClasses = option.className ? option.className : '';
      const optionValue = option.value || option.textContent.trim();

      const isOptionDisabled = (option.disabled || isSelectDisabled) ? 'disabled' : '';
      const disabledRowClass = isOptionDisabled ? 'disabled-option' : '';

      return `
        <div class="form-check custom-option ${optionClasses} ${disabledRowClass}" data-value="${optionValue}">
          <input class="form-check-input" type="${inputType}" name="${isMultiple ? '' : inputName}" value="${optionValue}" id="${uniqueId}" ${isChecked} ${isOptionDisabled}>
          <label class="form-check-label w-100" for="${uniqueId}">${option.textContent.trim()}</label>
        </div>
      `;
    }

    let headerHtml = '';
    if (showSearch || showActions) {
      const searchHtml = showSearch ? `
        <div class="input-group ${select.classList.contains('form-select-lg') ? 'input-group-lg' : 'input-group-sm'}">
          <input type="text" class="form-control search-input" placeholder="Поиск..." ${isSelectDisabled}>
          <button class="btn btn-outline-secondary clear-search-btn" type="button" title="Очистить поиск" ${isSelectDisabled}></button>
        </div>` : '';

      const actionsHtml = showActions ? `
        <div class="d-flex align-items-center row-gap-2">
          <div class="d-flex gap-1">
            <button type="button" class="btn btn-link p-0 text-decoration-none btn-sm select-all-btn ${isSelectDisabled}" title="Выбрать всё"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16"><path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/></svg></button>
            <button type="button" class="btn btn-link p-0 text-decoration-none btn-sm text-danger clear-all-btn ${isSelectDisabled}" title="Сбросить"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg></button>
          </div>
          <button type="button" class="btn btn-link p-0 text-decoration-none btn-sm apply-btn ms-auto ${isSelectDisabled}" title="Применить" style="color: var(--bs-success) !important;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg></button>
        </div>` : '';

      headerHtml = `
        <div class="multiselect-header">
          ${searchHtml}
          ${actionsHtml}
        </div>`;
    }

    const autoCloseAttr = isMultiple ? 'data-bs-auto-close="off"' : '';

    dropdownWrapper.innerHTML = `
      <button class="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center ${btnSizeClass}" 
              type="button" data-bs-toggle="dropdown" ${autoCloseAttr} ${isSelectDisabled}>
        <span class="dropdown-label text-truncate">${placeholder}</span>
      </button>
      <div class="dropdown-menu w-100">
        ${headerHtml}
        <div class="options-list">
          ${optionsHtml}
          <div class="text-muted small text-center py-2 no-results" style="display: none;">Нет элементов для отображения</div>
        </div>
      </div>
    `;

    select.parentNode.insertBefore(dropdownWrapper, select.nextSibling);

    const label = dropdownWrapper.querySelector('.dropdown-label');
    const searchInput = dropdownWrapper.querySelector('.search-input');
    const clearSearchBtn = dropdownWrapper.querySelector('.clear-search-btn');
    const customOptions = dropdownWrapper.querySelectorAll('.custom-option');
    const optionsList = dropdownWrapper.querySelector('.options-list');
    const noResults = dropdownWrapper.querySelector('.no-results');
    const selectAllBtn = dropdownWrapper.querySelector('.select-all-btn');
    const clearAllBtn = dropdownWrapper.querySelector('.clear-all-btn');
    const applyBtn = dropdownWrapper.querySelector('.apply-btn');

    if (maxItems && customOptions.length > maxItems) {
      optionsList.style.setProperty('--max-items', maxItems);
      optionsList.classList.add('has-max-items');
    }

    if (isSelectDisabled) return;

    function syncCustomToNative(e) {
      customOptions.forEach(optionDiv => {
        if (optionDiv.classList.contains('disabled-option')) return;

        const val = optionDiv.dataset.value;
        const checkbox = optionDiv.querySelector('.form-check-input');
        if (!checkbox) return;

        const isChecked = checkbox.checked;
        let nativeOption = select.querySelector(`option[value="${val}"]`);
        
        if (!nativeOption) {
          nativeOption = Array.from(select.options).find(opt => opt.textContent.trim() === val);
        }
        
        if (nativeOption) nativeOption.selected = isChecked;
      });

      select.dispatchEvent(new Event('change', { bubbles: true }));

      const selectedOptions = Array.from(select.options).filter(opt => opt.selected);

      if (selectedOptions.length > 0) {
        if (select.classList.contains('is-invalid') || dropdownWrapper.classList.contains('is-invalid')) {
          select.classList.remove('is-invalid');
          dropdownWrapper.classList.remove('is-invalid');
        }
      } else if (initialInvalidState) {
        select.classList.add('is-invalid');
        dropdownWrapper.classList.add('is-invalid');
      }

      updateLabelText();

      if (!isMultiple && e && e.target.classList.contains('form-check-input')) {
        const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownWrapper.querySelector('.dropdown-toggle'));
        bsDropdown.hide();
      }
    }

    function updateLabelText() {
      const selectedOptions = Array.from(select.options).filter(opt => opt.selected);

      if (selectedOptions.length === 0) {
        label.textContent = placeholder;
      } else if (isMultiple) {
        if (selectedOptions.length <= 2) {
          const names = selectedOptions.map(opt => opt.textContent.trim());
          label.textContent = names.join(', ');
        } else {
          label.textContent = `Выбрано элементов: ${selectedOptions.length}`;
        }
      } else {
        if (selectedOptions.length > 0) {
          label.textContent = selectedOptions[0].textContent.trim();
        } else {
          label.textContent = placeholder;
        }
      }
    }

    function syncNativeToCustom() {
      customOptions.forEach(optionDiv => {
        const checkbox = optionDiv.querySelector('.form-check-input');
        if (!checkbox) return;

        const val = optionDiv.dataset.value;
        let nativeOption = select.querySelector(`option[value="${val}"]`);

        if (!nativeOption) {
          nativeOption = Array.from(select.options).find(opt => opt.textContent.trim() === val);
        }

        checkbox.checked = nativeOption ? nativeOption.selected : false;
      });

      updateLabelText();
    }

    function filterItems() {
      const filter = searchInput.value.toLowerCase();
      let hasVisibleItems = false;

      customOptions.forEach(optionDiv => {
        const labelElement = optionDiv.querySelector('.form-check-label');
        const text = labelElement ? labelElement.textContent.toLowerCase() : '';

        if (text.includes(filter)) {
          optionDiv.style.display = '';
          hasVisibleItems = true;
        } else {
          optionDiv.style.setProperty('display', 'none', 'important');
        }
      });

      const groupLabels = optionsList.querySelectorAll('.multiselect-group-label');
      const hrs = optionsList.querySelectorAll('.multiselect-hr');

      if (filter.length > 0) {
        groupLabels.forEach(el => el.style.display = 'none');
        hrs.forEach(el => el.style.display = 'none');
      } else {
        groupLabels.forEach(el => el.style.display = '');
        hrs.forEach(el => el.style.display = '');
      }

      if (hasVisibleItems) {
        if (noResults) noResults.style.display = 'none';
        if (selectAllBtn) selectAllBtn.classList.remove('disabled');
      } else {
        if (noResults) noResults.style.display = 'block';
        if (selectAllBtn) selectAllBtn.classList.add('disabled');
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterItems);
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.value = '';
        filterItems();
        searchInput.focus();
      });
    }

    customOptions.forEach(optionDiv => {
      optionDiv.addEventListener('click', (e) => {
        if (isMultiple) {
          e.stopPropagation();
        }
      });

      const checkbox = optionDiv.querySelector('.form-check-input');
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          e.stopPropagation();
          syncCustomToNative(e);
        });
      }
    });

    optionsList.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    optionsList.addEventListener('change', syncCustomToNative);

    select.addEventListener('change', syncNativeToCustom);

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        customOptions.forEach(optionDiv => {
          if (optionDiv.style.display !== 'none' && !optionDiv.classList.contains('disabled-option')) { optionDiv.querySelector('.form-check-input').checked = true; }
        }); syncCustomToNative();
      });
    }
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        customOptions.forEach(optionDiv => {
          if (optionDiv.style.display !== 'none' && !optionDiv.classList.contains('disabled-option')) {
            optionDiv.querySelector('.form-check-input').checked = false;
          }
        });
        syncCustomToNative();
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        syncCustomToNative();
        const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownWrapper.querySelector('.dropdown-toggle'));
        bsDropdown.hide();
      });
    }

    updateLabelText();
  });
});

