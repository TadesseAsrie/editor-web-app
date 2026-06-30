/**
 * WORDCRAFT OFFICE ENGINE APPLICATION INFRASTRUCTURE ARCHITECTURE PIPELINES
 * Core Framework Architecture Module written in ECMA Script 6 Vanilla Implementation Profiles.
 */

(function () {
  "use strict";

  // Global Application State Registry Architecture Frame Model Envelopes
  const State = {
    history: [],
    historyPointer: -1,
    maxHistory: 100,
    autosaveTimer: null,
    activeTable: null,
    activeImage: null,
    zoomFactor: 1.0,
    searchMatches: [],
    activeSearchIndex: -1,
    currentFileUid: "doc_default_01",
    isSpellCheckActive: true,
  };

  // DOM UI Selection Cache Tree Strategy Mapping Structure
  const DOM = {
    editor: document.getElementById("wysiwyg-editor-core"),
    pageSurface: document.getElementById("page-surface-root"),
    docTitle: document.getElementById("document-title"),
    saveStatus: document.getElementById("save-status"),
    statusBar: {
      pageNum: document.getElementById("sb-page-num"),
      wordCount: document.getElementById("sb-word-count"),
      charCount: document.getElementById("sb-char-count"),
      coords: {
        line: document.getElementById("sb-coord-line"),
        col: document.getElementById("sb-coord-col"),
      },
      payloadSize: document.getElementById("sb-doc-size-metric"),
    },
    sidebars: {
      outline: document.getElementById("sidebar-navigation-outline"),
      metrics: document.getElementById("sidebar-live-metrics"),
      outlineTree: document.getElementById("document-outline-tree"),
      recentList: document.getElementById("recent-documents-list"),
      bookmarksList: document.getElementById("bookmarks-anchor-list-wrapper"),
    },
    huds: {
      table: document.getElementById("table-hud-toolbar"),
      image: document.getElementById("image-manipulator-hud"),
    },
    contextMenu: document.getElementById("custom-rightclick-context-menu"),
    modal: document.getElementById("global-system-modal-container"),
    modalTitle: document.getElementById("modal-dialog-title"),
    modalBody: document.getElementById("modal-dialog-dynamic-body-payload"),
    modalFooter: document.getElementById("modal-dialog-footer-actions"),
    toastContainer: document.getElementById("toast-alerts-stream-container"),
    hiddenFile: document.getElementById("hidden-file-pipeline-picker"),
    hiddenImage: document.getElementById("hidden-image-pipeline-picker"),
    zoomSelect: document.getElementById("canvas-zoom-slider-dropdown"),
  };

  /* ==========================================================================
       CORE BUSINESS ENGINE INITIALIZER PIPELINE ROUTINES
       ========================================================================== */
  function initApplicationCoreEngine() {
    registerRibbonTabNavigationEvents();
    registerFormattingCommandPipelineListeners();
    registerSystemEditorEventStreams();
    registerFileManagementSubsystemListeners();
    registerGlobalKeyboardShortcutEngine();
    registerCustomContextMenuInterceptors();
    registerModalDismissalMechanisms();
    registerTableAndImageElementManipulationArchitectures();

    // Hydrate Environment States from LocalStorage caches
    hydrateSystemConfigurationPreferences();
    restorePreviousDocumentStateOnBoot();
    triggerLiveCalculatedAnalysisMetricsPipeline();
    appendSystemStateTimelineSnapshot();

    // Fire Initialization Success Alert Toast
    spawnToastNotificationAlert(
      "WordCraft Engine Online: Document Cloud State Active",
      "success",
    );
  }

  /* ==========================================================================
       UI INTERACTION LOOPS, ROUTERS, INTERRUPTS & NOTIFICATIONS ARCHITECTURE
       ========================================================================== */
  function spawnToastNotificationAlert(message, variant = "success") {
    const toast = document.createElement("div");
    toast.className = `toast-msg-node ${variant}`;
    toast.innerHTML = `<i class="fa-solid ${variant === "success" ? "fa-circle-check" : variant === "error" ? "fa-circle-exclamation" : "fa-triangle-exclamation"}"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function registerRibbonTabNavigationEvents() {
    document.querySelectorAll(".ribbon-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        document
          .querySelectorAll(".ribbon-tab")
          .forEach((t) => t.classList.remove("active"));
        document
          .querySelectorAll(".ribbon-panel")
          .forEach((p) => p.classList.remove("active"));

        tab.classList.add("active");
        const targetPanel = document.getElementById(
          tab.getAttribute("data-target"),
        );
        if (targetPanel) targetPanel.classList.add("active");
      });
    });

    // Setup Sidebar Toggle Menus Bindings
    document.querySelectorAll(".close-sidebar-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.getAttribute("data-target"));
        if (target) target.classList.add("hidden");
      });
    });

    // Hook Accordion Structural Actions
    document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const body = trigger.nextElementSibling;
        if (body)
          body.style.display = body.style.display === "none" ? "block" : "none";
      });
    });
  }

  function openGlobalModalSystemWrapper(
    title,
    markupPayload,
    footerActionsArray = [],
  ) {
    DOM.modalTitle.innerText = title;
    DOM.modalBody.innerHTML = markupPayload;
    DOM.modalFooter.innerHTML = "";

    footerActionsArray.forEach((config) => {
      const btn = document.createElement("button");
      btn.className = `action-btn ${config.variant || "secondary"}`;
      btn.innerText = config.text;
      btn.addEventListener("click", (e) => config.handler(e, DOM.modalBody));
      DOM.modalFooter.appendChild(btn);
    });

    DOM.modal.style.display = "flex";
    DOM.modal.setAttribute("aria-hidden", "false");
  }

  function registerModalDismissalMechanisms() {
    document
      .getElementById("modal-close-dismiss-btn")
      .addEventListener("click", closeGlobalModalSystemWrapper);
    DOM.modal.addEventListener("click", (e) => {
      if (e.target === DOM.modal) closeGlobalModalSystemWrapper();
    });
  }

  function closeGlobalModalSystemWrapper() {
    DOM.modal.style.display = "none";
    DOM.modal.setAttribute("aria-hidden", "true");
  }

  /* ==========================================================================
       TEXT FORMATTING & PARAGRAPH MANAGEMENT INTERFACES SYSTEM
       ========================================================================== */
  function executeTextEditorDocumentFormatCommand(
    commandId,
    argumentValue = null,
  ) {
    DOM.editor.focus();
    document.execCommand(commandId, false, argumentValue);
    triggerLiveCalculatedAnalysisMetricsPipeline();
    appendSystemStateTimelineSnapshot();
  }

  function registerFormattingCommandPipelineListeners() {
    // Direct Action Map Structural Conversions Bindings
    const commandMappings = {
      "ribbon-bold": "bold",
      "ribbon-italic": "italic",
      "ribbon-underline": "underline",
      "ribbon-strike": "strikeThrough",
      "ribbon-sub": "subscript",
      "ribbon-sup": "superscript",
      "ribbon-align-left": "justifyLeft",
      "ribbon-align-center": "justifyCenter",
      "ribbon-align-right": "justifyRight",
      "ribbon-align-justify": "justifyFull",
      "ribbon-list-bullets": "insertUnorderedList",
      "ribbon-list-numbers": "insertOrderedList",
    };

    Object.keys(commandMappings).forEach((btnId) => {
      document.getElementById(btnId)?.addEventListener("click", (e) => {
        executeTextEditorDocumentFormatCommand(commandMappings[btnId]);
        e.currentTarget.classList.toggle("active");
      });
    });

    // Dropdown Structural Intercept Vectors
    document
      .getElementById("font-family-select")
      .addEventListener("change", (e) => {
        executeTextEditorDocumentFormatCommand("fontName", e.target.value);
      });

    document
      .getElementById("font-size-select")
      .addEventListener("change", (e) => {
        executeTextEditorDocumentFormatCommand("fontSize", e.target.value);
      });

    document
      .getElementById("ribbon-forecolor")
      .addEventListener("input", (e) => {
        executeTextEditorDocumentFormatCommand("foreColor", e.target.value);
      });

    document
      .getElementById("ribbon-backcolor")
      .addEventListener("input", (e) => {
        executeTextEditorDocumentFormatCommand("hiliteColor", e.target.value);
      });

    // Complex Typography Custom Action Bindings
    document
      .getElementById("ribbon-font-grow")
      ?.addEventListener("click", () => {
        modifySelectionFontSizeDelta(1);
      });
    document
      .getElementById("ribbon-font-shrink")
      ?.addEventListener("click", () => {
        modifySelectionFontSizeDelta(-1);
      });

    document
      .getElementById("ribbon-clear-format")
      ?.addEventListener("click", () => {
        executeTextEditorDocumentFormatCommand("removeFormat");
      });

    // Setup Predefined Styles Presets Gallery Pipeline
    document
      .querySelectorAll(".style-preset-btn, .style-preset-btnHeading")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const styleType = btn.getAttribute("data-style");
          if (styleType === "normal") {
            executeTextEditorDocumentFormatCommand("formatBlock", "<p>");
          } else if (styleType === "h1" || styleType === "h2") {
            executeTextEditorDocumentFormatCommand(
              "formatBlock",
              `<${styleType.toUpperCase()}>`,
            );
          } else if (styleType === "quote") {
            executeTextEditorDocumentFormatCommand(
              "formatBlock",
              "<blockquote>",
            );
          }
          document
            .querySelectorAll(".style-preset-btn, .style-preset-btnHeading")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });

    // Micro-Typography Parameters Adjustment Real-Time Bindings
    document
      .getElementById("prop-letter-spacing")
      .addEventListener("input", (e) => {
        DOM.editor.style.letterSpacing = `${e.target.value}px`;
      });
    document
      .getElementById("prop-para-spacing")
      .addEventListener("input", (e) => {
        const cssStyle = document.createElement("style");
        cssStyle.innerText = `.canvas-rich-editable-region p { margin-bottom: ${e.target.value}px !important; }`;
        document.head.appendChild(cssStyle);
      });
    document
      .getElementById("ribbon-line-height")
      .addEventListener("change", (e) => {
        DOM.editor.style.lineHeight = e.target.value;
      });

    // Text transformations uppercase lowercase capitalize
    document
      .getElementById("menu-fmt-upper")
      .addEventListener("click", () => transformSelectedTextCase("upper"));
    document
      .getElementById("menu-fmt-lower")
      .addEventListener("click", () => transformSelectedTextCase("lower"));
    document
      .getElementById("menu-fmt-cap")
      .addEventListener("click", () => transformSelectedTextCase("capitalize"));
  }

  function modifySelectionFontSizeDelta(stepSize) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const container =
      range.commonAncestorContainer.nodeType === 3
        ? range.commonAncestorContainer.parentNode
        : range.commonAncestorContainer;
    let currentSize = window.getComputedStyle(container).fontSize;
    let parsedNum = parseFloat(currentSize) + stepSize * 2;
    container.style.fontSize = `${parsedNum}px`;
    appendSystemStateTimelineSnapshot();
  }

  function transformSelectedTextCase(caseMode) {
    const selection = window.getSelection();
    if (!selection.toString()) return;
    let originalText = selection.toString();
    let modifiedText = "";

    if (caseMode === "upper") modifiedText = originalText.toUpperCase();
    else if (caseMode === "lower") modifiedText = originalText.toLowerCase();
    else if (caseMode === "capitalize") {
      modifiedText = originalText.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(modifiedText));
    appendSystemStateTimelineSnapshot();
  }

  /* ==========================================================================
       INSERT MODULE EXTRA FEATURES (TABLES, IMAGES, CODEBLOCKS, EMBEDS)
       ========================================================================== */
  function registerTableAndImageElementManipulationArchitectures() {
    // Core Embed Intercept Pipeline Hooks for Layout Panels Injection
    document
      .getElementById("menu-ins-table")
      .addEventListener("click", promptAndBuildDataTableGridStructure);
    document
      .getElementById("ribbon-ins-table-grid")
      .addEventListener("click", promptAndBuildDataTableGridStructure);

    document
      .getElementById("menu-ins-image")
      .addEventListener("click", () => DOM.hiddenImage.click());
    document
      .getElementById("ribbon-ins-img-file")
      .addEventListener("click", () => DOM.hiddenImage.click());

    DOM.hiddenImage.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fileReaderStream = new FileReader();
      fileReaderStream.onload = function (evt) {
        injectGraphicAssetBlobToCursorRange(evt.target.result);
      };
      fileReaderStream.readAsDataURL(file);
    });

    // Hyperlink Injection Event Listeners
    const linkHandler = () => {
      const path = prompt(
        "Enter hyperlink destination URL target coordinates:",
      );
      if (path) executeTextEditorDocumentFormatCommand("createLink", path);
    };
    document
      .getElementById("menu-ins-link")
      .addEventListener("click", linkHandler);
    document
      .getElementById("ribbon-ins-hyperlink")
      .addEventListener("click", linkHandler);

    // Native System Objects Injectors Elements
    document
      .getElementById("menu-ins-hr")
      .addEventListener("click", () =>
        executeTextEditorDocumentFormatCommand("insertHorizontalRule"),
      );
    document
      .getElementById("ribbon-ins-hr-line")
      .addEventListener("click", () =>
        executeTextEditorDocumentFormatCommand("insertHorizontalRule"),
      );
    document
      .getElementById("ribbon-ins-pagebreak")
      .addEventListener("click", () => {
        executeTextEditorDocumentFormatCommand(
          "insertHTML",
          '<hr class="page-boundary-break-line" style="border-top:3px dashed #ef4444; margin:30px 0;" data-pdf-break="true">',
        );
      });

    document
      .getElementById("menu-ins-date")
      .addEventListener("click", () =>
        executeTextEditorDocumentFormatCommand(
          "insertHTML",
          new Date().toLocaleDateString(),
        ),
      );
    document
      .getElementById("menu-ins-time")
      .addEventListener("click", () =>
        executeTextEditorDocumentFormatCommand(
          "insertHTML",
          new Date().toLocaleTimeString(),
        ),
      );
    document.getElementById("menu-ins-code").addEventListener("click", () => {
      executeTextEditorDocumentFormatCommand(
        "insertHTML",
        `<pre><code>// Insert syntax asset code block framework here\n</code></pre>`,
      );
    });

    // Data Table Manipulation Floating HUD Operational Controls
    document
      .getElementById("hud-table-row-add")
      .addEventListener("click", () => {
        if (!State.activeTable) return;
        const newRow = State.activeTable.insertRow(-1);
        const cellCount = State.activeTable.rows[0].cells.length;
        for (let i = 0; i < cellCount; i++) {
          const cell = newRow.insertCell(i);
          cell.innerHTML = "Data Entry Cell";
        }
        appendSystemStateTimelineSnapshot();
      });

    document
      .getElementById("hud-table-row-del")
      .addEventListener("click", () => {
        if (!State.activeTable || State.activeTable.rows.length <= 1) return;
        State.activeTable.deleteRow(-1);
        appendSystemStateTimelineSnapshot();
      });

    document
      .getElementById("hud-table-cell-color")
      .addEventListener("click", () => {
        if (!State.activeTable) return;
        const chosenColor = prompt(
          "Enter hexadecimal or text color properties asset target (#ffdfdf etc):",
          "#f1f5f9",
        );
        if (chosenColor) {
          State.activeTable
            .querySelectorAll("td")
            .forEach((cell) => (cell.style.backgroundColor = chosenColor));
          appendSystemStateTimelineSnapshot();
        }
      });

    document
      .getElementById("hud-table-destroy")
      .addEventListener("click", () => {
        if (!State.activeTable) return;
        State.activeTable.remove();
        DOM.huds.table.style.display = "none";
        State.activeTable = null;
        appendSystemStateTimelineSnapshot();
      });

    // Floating Image Controller Operations Bindings
    document.getElementById("img-action-left").addEventListener("click", () => {
      if (State.activeImage) State.activeImage.style.float = "left";
    });
    document
      .getElementById("img-action-center")
      .addEventListener("click", () => {
        if (State.activeImage) {
          State.activeImage.style.float = "none";
          State.activeImage.style.display = "block";
          State.activeImage.style.margin = "10px auto";
        }
      });
    document
      .getElementById("img-action-right")
      .addEventListener("click", () => {
        if (State.activeImage) State.activeImage.style.float = "right";
      });
    document
      .getElementById("img-action-delete")
      .addEventListener("click", () => {
        if (State.activeImage) {
          State.activeImage.remove();
          DOM.huds.image.style.display = "none";
          State.activeImage = null;
        }
      });
  }

  function promptAndBuildDataTableGridStructure() {
    const rows = parseInt(
      prompt(
        "Specify quantitative vertical rows sequence layout limit:",
        "3",
      ) || "0",
    );
    const cols = parseInt(
      prompt("Specify quantitative grid columns layout width elements:", "3") ||
        "0",
    );
    if (!rows || !cols) return;

    let tableMarkup = "<table><thead><tr>";
    for (let j = 0; j < cols; j++)
      tableMarkup += "<th>Header Token Column</th>";
    tableMarkup += "</tr></thead><tbody>";
    for (let i = 0; i < rows; i++) {
      tableMarkup += "<tr>";
      for (let j = 0; j < cols; j++)
        tableMarkup += "<td>Content Block Variable</td>";
      tableMarkup += "</tr>";
    }
    tableMarkup += "</tbody></table><p></p>";
    executeTextEditorDocumentFormatCommand("insertHTML", tableMarkup);
  }

  function injectGraphicAssetBlobToCursorRange(base64Payload) {
    const nodeImg = `<img src="${base64Payload}" class="resizable-document-image-node" style="max-width:100%;" alt="User Injected Graphics Asset Base64 Frame">`;
    executeTextEditorDocumentFormatCommand("insertHTML", nodeImg);
  }

  /* ==========================================================================
       SEARCH, BLUEPRINTS DISCOVERY AND GLOBAL REGULATED MANAGEMENT ENGINES
       ========================================================================== */
  function performLiveCanvasSearchAndHighlightMatches() {
    const queryTerm = document.getElementById("ribbon-search-input").value;
    if (!queryTerm) {
      clearSearchMatchesHighlights();
      return;
    }

    const isCaseSensitive = document.getElementById(
      "search-case-sensitive",
    ).checked;
    clearSearchMatchesHighlights();

    const searchEngineTraversalRegex = new RegExp(
      `(${escapeRegExpPatternChars(queryTerm)})`,
      isCaseSensitive ? "g" : "gi",
    );

    // Linear stream walk tree execution
    const textNodesArray = [];
    const treeWalker = document.createTreeWalker(
      DOM.editor,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );
    let currentWalkNode = treeWalker.nextNode();
    while (currentWalkNode) {
      textNodesArray.push(currentWalkNode);
      currentWalkNode = treeWalker.nextNode();
    }

    // Process search highlighting matching nodes backward to protect indices updates structural safety
    textNodesArray.forEach((node) => {
      if (
        node.parentNode.classList.contains("search-term-match-highlight") ||
        !node.nodeValue.trim()
      )
        return;
      if (searchEngineTraversalRegex.test(node.nodeValue)) {
        const fragmentContainer = document.createElement("span");
        fragmentContainer.innerHTML = node.nodeValue.replace(
          searchEngineTraversalRegex,
          '<span class="search-term-match-highlight">$1</span>',
        );
        node.parentNode.replaceChild(fragmentContainer, node);
      }
    });

    State.searchMatches = Array.from(
      DOM.editor.querySelectorAll(".search-term-match-highlight"),
    );
    if (State.searchMatches.length > 0) {
      State.activeSearchIndex = 0;
      focusIndexedSearchMatchElement(0);
      spawnToastNotificationAlert(
        `Identified ${State.searchMatches.length} matching occurrences.`,
        "success",
      );
    } else {
      spawnToastNotificationAlert(
        "No matching metrics discovered inside current workspace framework context.",
        "warning",
      );
    }
  }

  function focusIndexedSearchMatchElement(index) {
    State.searchMatches.forEach((el, idx) => {
      el.classList.remove("active-focus");
      if (idx === index) {
        el.classList.add("active-focus");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  function clearSearchMatchesHighlights() {
    DOM.editor
      .querySelectorAll(".search-term-match-highlight")
      .forEach((node) => {
        const textNode = document.createTextNode(node.textContent);
        node.parentNode.replaceChild(textNode, node);
      });
    DOM.editor.normalize();
    State.searchMatches = [];
    State.activeSearchIndex = -1;
  }

  function escapeRegExpPatternChars(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* ==========================================================================
       FILE MANAGEMENT LIFECYCLE MECHANISMS & LOCALSTORAGE CACHES PIPELINE
       ========================================================================== */
  function commitActiveWorkspaceToLocalStorageStateStore(
    isAutomatedFeedbackLoop = true,
  ) {
    const filePackagePayload = {
      uid: State.currentFileUid,
      title: DOM.docTitle.value,
      bodyMarkup: DOM.editor.innerHTML,
      timestamp: Date.now(),
    };

    localStorage.setItem(
      `wordcraft_file_${State.currentFileUid}`,
      JSON.stringify(filePackagePayload),
    );

    // Track recent histories metadata rosters profiles indices pointers array targets
    let roster = JSON.parse(
      localStorage.getItem("wordcraft_roster_registry") || "[]",
    );
    if (!roster.includes(State.currentFileUid)) {
      roster.push(State.currentFileUid);
      localStorage.setItem("wordcraft_roster_registry", JSON.stringify(roster));
    }

    updateRecentFilesHistorySidebarWidget();

    const formattedDate = new Date().toLocaleTimeString();
    DOM.saveStatus.innerText = `Autosaved: ${formattedDate}`;

    // Re-calculate size footprints metrics items allocation parameters
    const bytesMetric =
      encodeURIComponent(DOM.editor.innerHTML).split(/%..|./).length - 1;
    DOM.statusBar.payloadSize.innerText = `Payload Size: ${(bytesMetric / 1024).toFixed(2)} KB`;

    if (!isAutomatedFeedbackLoop) {
      spawnToastNotificationAlert(
        "Document structural layout bundle synchronized natively to browser data silos.",
        "success",
      );
    }
  }

  function restorePreviousDocumentStateOnBoot() {
    const lastActiveFileId =
      localStorage.getItem("wordcraft_system_last_active_uid") ||
      "doc_default_01";
    State.currentFileUid = lastActiveFileId;

    const preservedPayloadData = localStorage.getItem(
      `wordcraft_file_${lastActiveFileId}`,
    );
    if (preservedPayloadData) {
      const model = JSON.parse(preservedPayloadData);
      DOM.docTitle.value = model.title || "Untitled Document";
      DOM.editor.innerHTML = model.bodyMarkup || "<p></p>";
    }

    // Setup the Autosave standard execution loops system frame tick frequency
    startAutosaveLoopRoutineDaemon();
    updateRecentFilesHistorySidebarWidget();
  }

  function startAutosaveLoopRoutineDaemon() {
    if (State.autosaveTimer) clearInterval(State.autosaveTimer);
    State.autosaveTimer = setInterval(() => {
      if (document.getElementById("setting-autosave-toggle").checked) {
        commitActiveWorkspaceToLocalStorageStateStore(true);
      }
    }, 5000);
  }

  function updateRecentFilesHistorySidebarWidget() {
    const roster = JSON.parse(
      localStorage.getItem("wordcraft_roster_registry") || "[]",
    );
    DOM.sidebars.recentList.innerHTML = "";
    if (roster.length === 0) {
      DOM.sidebars.recentList.innerHTML =
        '<p class="empty-placeholder-msg">History log timeline index clean.</p>';
      return;
    }

    roster.forEach((uid) => {
      const targetMeta = JSON.parse(
        localStorage.getItem(`wordcraft_file_${uid}`) || "{}",
      );
      if (!targetMeta.title) return;
      const recordRow = document.createElement("button");
      recordRow.className = "template-inject-btn";
      recordRow.innerHTML = `<i class="fa-solid fa-file-lines"></i> ${targetMeta.title}`;
      recordRow.addEventListener("click", () => {
        commitActiveWorkspaceToLocalStorageStateStore(true);
        State.currentFileUid = uid;
        localStorage.setItem("wordcraft_system_last_active_uid", uid);
        restorePreviousDocumentStateOnBoot();
        spawnToastNotificationAlert(
          "Workspace switched directly to selected targets record file context blueprint.",
          "success",
        );
      });
      DOM.sidebars.recentList.appendChild(recordRow);
    });
  }

  function hydrateSystemConfigurationPreferences() {
    // Enforce settings options change monitoring system
    document
      .getElementById("canvas-theme-select")
      .addEventListener("change", (e) => {
        document.body.setAttribute("data-theme", e.target.value);
        localStorage.setItem("wordcraft_pref_theme", e.target.value);
      });

    const persistentThemeSkinKey =
      localStorage.getItem("wordcraft_pref_theme") || "office-blue";
    document.body.setAttribute("data-theme", persistentThemeSkinKey);
    document.getElementById("canvas-theme-select").value =
      persistentThemeSkinKey;

    // Document Geometries Options Selector mapping bindings
    document
      .getElementById("canvas-geometry-select")
      .addEventListener("change", (e) => {
        DOM.pageSurface.setAttribute("data-geom", e.target.value);
      });

    // Setup Zoom Components Handlers
    DOM.zoomSelect.addEventListener("change", (e) => {
      State.zoomFactor = parseFloat(e.target.value);
      DOM.pageSurface.style.transform = `scale(${State.zoomFactor})`;
    });
    document
      .getElementById("btn-zoom-increment")
      .addEventListener("click", () => {
        State.zoomFactor = Math.min(State.zoomFactor + 0.25, 2.0);
        DOM.zoomSelect.value = State.zoomFactor.toString();
        DOM.pageSurface.style.transform = `scale(${State.zoomFactor})`;
      });
    document
      .getElementById("btn-zoom-decrement")
      .addEventListener("click", () => {
        State.zoomFactor = Math.max(State.zoomFactor - 0.25, 0.5);
        DOM.zoomSelect.value = State.zoomFactor.toString();
        DOM.pageSurface.style.transform = `scale(${State.zoomFactor})`;
      });
  }

  function registerFileManagementSubsystemListeners() {
    document
      .getElementById("btn-quick-save")
      .addEventListener("click", () =>
        commitActiveWorkspaceToLocalStorageStateStore(false),
      );
    document
      .getElementById("menu-file-save")
      .addEventListener("click", () =>
        commitActiveWorkspaceToLocalStorageStateStore(false),
      );

    document.getElementById("menu-file-new").addEventListener("click", () => {
      commitActiveWorkspaceToLocalStorageStateStore(true);
      State.currentFileUid = "doc_" + Date.now();
      DOM.docTitle.value = "New Document Workspace Template File";
      DOM.editor.innerHTML =
        "<p>Erase context lines to append content nodes records streams layout blueprints...</p>";
      commitActiveWorkspaceToLocalStorageStateStore(false);
      spawnToastNotificationAlert(
        "New isolated operational workspace environment initialized.",
        "success",
      );
    });

    document
      .getElementById("menu-file-open")
      .addEventListener("click", () => DOM.hiddenFile.click());
    DOM.hiddenFile.addEventListener("change", (e) => {
      const targetFileDesc = e.target.files[0];
      if (!targetFileDesc) return;
      const fileStreamReaderObj = new FileReader();
      fileStreamReaderObj.onload = function (evt) {
        DOM.editor.innerHTML = evt.target.result;
        DOM.docTitle.value = targetFileDesc.name.split(".")[0];
        appendSystemStateTimelineSnapshot();
        spawnToastNotificationAlert(
          "External filesystem blueprint loaded successfully to editor viewports core canvas layers.",
          "success",
        );
      };
      fileStreamReaderObj.readAsText(targetFileDesc);
    });

    // Downloader Export Interfaces Binding Pipelines Strategy
    document
      .getElementById("export-txt")
      .addEventListener("click", () =>
        triggerClientFileDownloadStreamDownload(
          DOM.editor.innerText,
          `${DOM.docTitle.value}.txt`,
          "text/plain",
        ),
      );
    document
      .getElementById("export-html")
      .addEventListener("click", () =>
        triggerClientFileDownloadStreamDownload(
          DOM.editor.innerHTML,
          `${DOM.docTitle.value}.html`,
          "text/html",
        ),
      );
    document.getElementById("export-md").addEventListener("click", () => {
      // Primitive Markdown Generator Simulator Converter Node Logic
      let markdownPayloadOutputString = DOM.editor.innerHTML
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
        .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
        .replace(/<br>/gi, "\n");
      triggerClientFileDownloadStreamDownload(
        markdownPayloadOutputString,
        `${DOM.docTitle.value}.md`,
        "text/markdown",
      );
    });

    document.getElementById("export-json").addEventListener("click", () => {
      const jsonSchema = JSON.stringify(
        {
          documentTitle: DOM.docTitle.value,
          contentRawHTML: DOM.editor.innerHTML,
          extractionDate: new Date().toISOString(),
        },
        null,
        2,
      );
      triggerClientFileDownloadStreamDownload(
        jsonSchema,
        `${DOM.docTitle.value}.json`,
        "application/json",
      );
    });

    document.getElementById("export-pdf").addEventListener("click", () => {
      spawnToastNotificationAlert(
        "Compiling vectors engines into high density PDF structure...",
        "warning",
      );
      const { jsPDF } = window.jspdf;
      const pdfDocInstance = new jsPDF("p", "pt", "a4");

      pdfDocInstance.html(DOM.pageSurface, {
        callback: function (pdf) {
          pdf.save(`${DOM.docTitle.value}.pdf`);
          spawnToastNotificationAlert(
            "PDF delivery package stream generated successfully.",
            "success",
          );
        },
        x: 10,
        y: 10,
        width: 550,
        windowWidth: 800,
      });
    });

    document
      .getElementById("menu-file-print")
      .addEventListener("click", () => window.print());

    // Template Presets Injections Infrastructure Mapping Strategy Loops
    document.querySelectorAll(".template-inject-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-tpl");
        if (mode === "memo") {
          DOM.editor.innerHTML = `<h1>MEMORANDUM CORPORATE BRIEF</h1><p><strong>TO:</strong> Distribution Roster Target Operations</p><p><strong>FROM:</strong> Project Engineering Lead Systems Architect</p><hr><p>Enter tactical execution structural guidelines items definitions parameter metrics here...</p>`;
        } else if (mode === "report") {
          DOM.editor.innerHTML = `<h1>EXECUTIVE METRICS REPORT BLUEPRINT</h1><h2>1. Core Project Target Scope Architecture</h2><p>Provide foundational metrics descriptions layout assessments indicators details elements here...</p><table><thead><tr><th>Indicator Token</th><th>Status Ratio</th></tr></thead><tbody><tr><td>Data Grid Node Alpha</td><td>Operational Normal</td></tr></tbody></table>`;
        } else if (mode === "clean") {
          DOM.editor.innerHTML = "<p></p>";
        }
        appendSystemStateTimelineSnapshot();
      });
    });
  }

  function triggerClientFileDownloadStreamDownload(
    payloadContent,
    filename,
    contentType,
  ) {
    const fileBlobContainerInstance = new Blob([payloadContent], {
      type: contentType,
    });
    const temporaryAnchorElement = document.createElement("a");
    temporaryAnchorElement.href = URL.createObjectURL(
      fileBlobContainerInstance,
    );
    temporaryAnchorElement.download = filename;
    temporaryAnchorElement.click();
    URL.revokeObjectURL(temporaryAnchorElement.href);
  }

  /* ==========================================================================
       UNDO REDO AND SYSTEM TIMELINE SNAPSHOT ENGINE ARCHITECTURES
       ========================================================================== */
  function appendSystemStateTimelineSnapshot() {
    // Evaluate snapshot updates criteria against structural timeline tracking requirements
    if (State.historyPointer < State.history.length - 1) {
      State.history = State.history.slice(0, State.historyPointer + 1);
    }
    State.history.push(DOM.editor.innerHTML);
    if (State.history.length > State.maxHistory) {
      State.history.shift();
    }
    State.historyPointer = State.history.length - 1;
  }

  function traverseSystemTimelineStateVectorDelta(directionOffset) {
    const targetPointerIdx = State.historyPointer + directionOffset;
    if (targetPointerIdx >= 0 && targetPointerIdx < State.history.length) {
      State.historyPointer = targetPointerIdx;
      DOM.editor.innerHTML = State.history[State.historyPointer];
      triggerLiveCalculatedAnalysisMetricsPipeline();
    } else {
      spawnToastNotificationAlert(
        "Boundary limit reached on timeline operational trace vectors paths.",
        "warning",
      );
    }
  }

  /* ==========================================================================
       GLOBAL SHORTCUTS & SYSTEM REGULATED CONTEXT MENUS INTERCEPTORS
       ========================================================================= */
  function registerGlobalKeyboardShortcutEngine() {
    document
      .getElementById("btn-quick-undo")
      .addEventListener("click", () =>
        traverseSystemTimelineStateVectorDelta(-1),
      );
    document
      .getElementById("btn-quick-redo")
      .addEventListener("click", () =>
        traverseSystemTimelineStateVectorDelta(1),
      );
    document
      .getElementById("menu-edit-undo")
      .addEventListener("click", () =>
        traverseSystemTimelineStateVectorDelta(-1),
      );
    document
      .getElementById("menu-edit-redo")
      .addEventListener("click", () =>
        traverseSystemTimelineStateVectorDelta(1),
      );

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            commitActiveWorkspaceToLocalStorageStateStore(false);
            break;
          case "z":
            e.preventDefault();
            traverseSystemTimelineStateVectorDelta(-1);
            break;
          case "y":
            e.preventDefault();
            traverseSystemTimelineStateVectorDelta(1);
            break;
          case "b":
            e.preventDefault();
            executeTextEditorDocumentFormatCommand("bold");
            break;
          case "i":
            e.preventDefault();
            executeTextEditorDocumentFormatCommand("italic");
            break;
          case "u":
            e.preventDefault();
            executeTextEditorDocumentFormatCommand("underline");
            break;
          case "n":
            e.preventDefault();
            document.getElementById("menu-file-new").click();
            break;
          case "o":
            e.preventDefault();
            DOM.hiddenFile.click();
            break;
          case "p":
            e.preventDefault();
            window.print();
            break;
          case "a":
            /* Standard baseline fallback selection native routines */ break;
        }
      }
    });
  }

  function registerCustomContextMenuInterceptors() {
    // Right click system layout handler execution interception routines
    DOM.editor.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      DOM.contextMenu.style.top = `${e.clientY}px`;
      DOM.contextMenu.style.left = `${e.clientX}px`;
      DOM.contextMenu.style.display = "block";
      DOM.contextMenu.setAttribute("aria-hidden", "false");
    });

    window.addEventListener("click", () => {
      DOM.contextMenu.style.display = "none";
      DOM.contextMenu.setAttribute("aria-hidden", "true");
    });

    DOM.contextMenu.querySelectorAll(".context-item").forEach((item) => {
      item.addEventListener("click", () => {
        const action = item.getAttribute("data-action");
        if (["bold", "italic", "underline"].includes(action)) {
          executeTextEditorDocumentFormatCommand(action);
        } else if (action === "selectall") {
          executeTextEditorDocumentFormatCommand("selectAll");
        } else if (action === "delete") {
          executeTextEditorDocumentFormatCommand("delete");
        } else if (action === "link") {
          document.getElementById("menu-ins-link").click();
        } else if (action === "image") {
          DOM.hiddenImage.click();
        }
      });
    });
  }

  /* ==========================================================================
       REAL-TIME STATISTICAL COMPUTATION METRICS ENGINE PIPELINES
       ========================================================================== */
  function registerSystemEditorEventStreams() {
    // Attach interactive mutation event interception triggers onto core editor editable element
    DOM.editor.addEventListener("input", () => {
      triggerLiveCalculatedAnalysisMetricsPipeline();
    });

    DOM.editor.addEventListener(
      "keyup",
      updateLiveCursorCoordinateTrackingHUDIndicators,
    );
    DOM.editor.addEventListener(
      "click",
      updateLiveCursorCoordinateTrackingHUDIndicators,
    );

    // Core Intercept Routines for Elements Selection States (Tables & Images)
    DOM.editor.addEventListener("click", (e) => {
      const tableNodeMatch = e.target.closest("table");
      if (tableNodeMatch) {
        State.activeTable = tableNodeMatch;
        positionContextSensitiveFloatingHUD(DOM.huds.table, tableNodeMatch);
      } else {
        DOM.huds.table.style.display = "none";
        State.activeTable = null;
      }

      if (e.target.tagName === "IMG") {
        State.activeImage = e.target;
        DOM.editor
          .querySelectorAll("img")
          .forEach((i) => i.classList.remove("selected-asset"));
        e.target.classList.add("selected-asset");
        positionContextSensitiveFloatingHUD(DOM.huds.image, e.target);
      } else {
        DOM.huds.image.style.display = "none";
        DOM.editor
          .querySelectorAll("img")
          .forEach((i) => i.classList.remove("selected-asset"));
        State.activeImage = null;
      }
    });

    // Search Interface Action Injections
    document
      .getElementById("ribbon-search-input")
      .addEventListener("input", performLiveCanvasSearchAndHighlightMatches);
    document.getElementById("btn-search-next").addEventListener("click", () => {
      if (State.searchMatches.length > 0) {
        State.activeSearchIndex =
          (State.activeSearchIndex + 1) % State.searchMatches.length;
        focusIndexedSearchMatchElement(State.activeSearchIndex);
      }
    });
    document.getElementById("btn-search-prev").addEventListener("click", () => {
      if (State.searchMatches.length > 0) {
        State.activeSearchIndex =
          (State.activeSearchIndex - 1 + State.searchMatches.length) %
          State.searchMatches.length;
        focusIndexedSearchMatchElement(State.activeSearchIndex);
      }
    });

    // Execute global string occurrences replacements
    document
      .getElementById("btn-replace-execute")
      .addEventListener("click", () => {
        const replaceTerm = document.getElementById(
          "ribbon-replace-input",
        ).value;
        const focusedMatch = DOM.editor.querySelector(
          ".search-term-match-highlight.active-focus",
        );
        if (focusedMatch) {
          focusedMatch.outerHTML = replaceTerm;
          appendSystemStateTimelineSnapshot();
          performLiveCanvasSearchAndHighlightMatches();
        }
      });

    document.getElementById("menu-view-spell").addEventListener("click", () => {
      State.isSpellCheckActive = !State.isSpellCheckActive;
      DOM.editor.setAttribute(
        "spellcheck",
        State.isSpellCheckActive.toString(),
      );
      spawnToastNotificationAlert(
        `Native browser diagnostics spellcheck: ${State.isSpellCheckActive ? "ACTIVE" : "DISABLED"}`,
        "warning",
      );
    });

    document
      .getElementById("ribbon-toggle-spellcheck")
      .addEventListener("click", (e) => {
        document.getElementById("menu-view-spell").click();
        e.currentTarget.classList.toggle("active");
      });
  }

  function positionContextSensitiveFloatingHUD(
    hudElement,
    targetAnchorElement,
  ) {
    const boundsRect = targetAnchorElement.getBoundingClientRect();
    const viewportContainerScrollOffset = document
      .getElementById("canvas-scroll-viewport")
      .getBoundingClientRect();

    hudElement.style.display = "flex";
    hudElement.style.top = `${boundsRect.top + document.getElementById("canvas-scroll-viewport").scrollTop - viewportContainerScrollOffset.top - 40}px`;
    hudElement.style.left = `${boundsRect.left + document.getElementById("canvas-scroll-viewport").scrollLeft - viewportContainerScrollOffset.left}px`;
  }

  function updateLiveCursorCoordinateTrackingHUDIndicators() {
    const selectionObj = window.getSelection();
    if (!selectionObj.rangeCount) return;

    // Compute structural baseline index ranges targets
    let lineIdx = 1,
      colIdx = 1;
    const range = selectionObj.getRangeAt(0);
    const clonedRangePointer = range.cloneRange();
    clonedRangePointer.selectNodeContents(DOM.editor);
    clonedRangePointer.setEnd(range.endContainer, range.endOffset);

    const contentsTextStream = clonedRangePointer.toString();
    const splitLinesArray = contentsTextStream.split("\n");
    lineIdx = splitLinesArray.length;
    colIdx = splitLinesArray[splitLinesArray.length - 1].length + 1;

    DOM.statusBar.coords.line.innerText = lineIdx;
    DOM.statusBar.coords.col.innerText = colIdx;
  }

  function triggerLiveCalculatedAnalysisMetricsPipeline() {
    const cleanContentTextStream = DOM.editor.innerText || "";

    // Quantitative computational string analytics regex splits
    const wordsArray = cleanContentTextStream
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);
    const totalWordsCount = wordsArray.length;
    const totalCharsCount = cleanContentTextStream.length;

    const totalParagraphsCount =
      DOM.editor.querySelectorAll("p, h1, h2, table, blockquote").length || 1;
    const totalSentencesCount = cleanContentTextStream
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;

    const standardMinutesReadCalculationValue = Math.ceil(
      totalWordsCount / 200,
    );

    // Update target interface widgets UI metrics fields
    document.getElementById("meta-stat-words").innerText = totalWordsCount;
    document.getElementById("meta-stat-chars").innerText = totalCharsCount;
    document.getElementById("meta-stat-paras").innerText = totalParagraphsCount;
    document.getElementById("meta-stat-sentences").innerText =
      totalSentencesCount;
    document.getElementById("meta-stat-readtime").innerText =
      `${standardMinutesReadCalculationValue} min read`;

    DOM.statusBar.wordCount.innerText = totalWordsCount;
    DOM.statusBar.charCount.innerText = totalCharsCount;

    // Compute and map document outline heading navigation nodes tracking system
    buildStructuredNavigationOutlineTreeDOMMap();
  }

  function buildStructuredNavigationOutlineTreeDOMMap() {
    DOM.sidebars.outlineTree.innerHTML = "";
    const structuralHeadingNodesList = DOM.editor.querySelectorAll("h1, h2");

    if (structuralHeadingNodesList.length === 0) {
      DOM.sidebars.outlineTree.innerHTML =
        '<p class="empty-placeholder-msg">No structured text headings captured yet.</p>';
      return;
    }

    structuralHeadingNodesList.forEach((heading, idx) => {
      const uid = `heading_anchor_node_${idx}`;
      heading.id = uid;

      const itemRow = document.createElement("button");
      itemRow.className = `template-inject-btn h-level-${heading.tagName.toLowerCase()}`;
      itemRow.style.paddingLeft =
        heading.tagName.toLowerCase() === "h2" ? "20px" : "10px";
      itemRow.innerHTML = `<i class="fa-solid id fa-angles-right"></i> ${heading.textContent}`;
      itemRow.addEventListener("click", () => {
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      DOM.sidebars.outlineTree.appendChild(itemRow);
    });
  }

  // Fire application stack initialization upon complete assets load events confirmation
  window.addEventListener("DOMContentLoaded", initApplicationCoreEngine);
})();
