import {isFunction, forEach} from 'min-dash';
import {
    domify,
    query as domQuery,
    closest as domClosest,
    attr as domAttr,
    clear as domClear,
    classes as domClasses,
    matches as domMatches,
    delegate as domDelegate,
    event as domEvent,
} from 'min-dom';

const TOGGLE_SELECTOR = '.djs-collapse-header';
const ENTRY_SELECTOR = '.entry';
const SLIDE_SELECTOR = '.djs-palette-toggle';
const ELEMENT_SELECTOR = `${TOGGLE_SELECTOR}, ${ENTRY_SELECTOR}, ${SLIDE_SELECTOR}`;

const PALETTE_OPEN_CLS = 'open';
const PALETTE_TWO_COLUMN_CLS = 'two-column';

/**
 * A palette containing modeling elements.
 */
export default function Palette(eventBus, canvas) {
    this._eventBus = eventBus;
    this._canvas = canvas;

    this._providers = [];

    const self = this;

    eventBus.on('tool-manager.update', event => {
        const {tool} = event;

        self.updateToolHighlight(tool);
    });

    eventBus.on('i18n.changed', () => {
        self._update();
    });

    eventBus.on('diagram.init', () => {
        self._diagramInitialized = true;

        // initialize + update once diagram is ready
        if (self._providers.length) {
            self._init();

            self._update();
        }
    });
}

Palette.$inject = ['eventBus', 'canvas'];

/**
 * Register a provider with the palette
 *
 * @param  {PaletteProvider} provider
 */
Palette.prototype.registerProvider = function(provider) {
    this._providers.push(provider);

    // postpone init / update until diagram is initialized
    if (!this._diagramInitialized) {
        return;
    }

    if (!this._container) {
        this._init();
    }

    this._update();
};

/**
 * Returns the palette entries for a given element
 *
 * @return {Array<PaletteEntryDescriptor>} list of entries
 */
Palette.prototype.getEntries = function() {
    const entries = {};

    // loop through all providers and their entries.
    // group entries by id so that overriding an entry is possible
    forEach(this._providers, provider => {
        const e = provider.getPaletteEntries();

        forEach(e, (entry, id) => {
            entries[id] = entry;
        });
    });

    return entries;
};

/**
 * Initialize
 */
Palette.prototype._init = function() {
    const canvas = this._canvas;
    const eventBus = this._eventBus;
    this._container = domify(Palette.HTML_MARKUP);
    const parent = domClosest(canvas.getContainer(), '.bjs-container');
    const container = this._container;
    const self = this;

    parent.insertBefore(container, parent.children[0]);

    domDelegate.bind(container, ELEMENT_SELECTOR, 'click', event => {
        const target = event.delegateTarget;

        // 菜单伸缩
        if (domMatches(target, TOGGLE_SELECTOR)) {
            return self.toggle(target);
        }

        // 左侧栏伸缩
        if (domMatches(target, SLIDE_SELECTOR)) {
            return self.slide(target);
        }

        self.trigger('click', event);
    });

    // prevent drag propagation
    domEvent.bind(container, 'mousedown', event => {
        event.stopPropagation();
    });

    // prevent drag propagation
    domDelegate.bind(container, ENTRY_SELECTOR, 'dragstart', event => {
        self.trigger('dragstart', event);
    });

    eventBus.on('canvas.resized', this._layoutChanged, this);

    eventBus.fire('palette.create', {
        container,
    });
};

/**
 * Update palette state.
 *
 * @param  {Object} [state] { open, twoColumn }
 */
Palette.prototype._toggleState = function(state) {
    state = state || {};

    const parent = this._getParentContainer();
    const container = this._container;
    const eventBus = this._eventBus;
    const cls = domClasses(container);
    const twoColumn =
        state.twoColumn || this._needsCollapse(parent.clientHeight, this._entries || {});

    // always update two column
    cls.toggle(PALETTE_TWO_COLUMN_CLS, twoColumn);
    if ('open' in state) {
        cls.toggle(PALETTE_OPEN_CLS, state.open);
    }

    eventBus.fire('palette.changed', {
        twoColumn,
        open: this.isOpen(),
    });
};

Palette.prototype._update = function() {
    this._entries = this.getEntries();
    const entriesContainer = domQuery('.djs-palette-entries', this._container);
    const entries = this._entries;

    domClear(entriesContainer);

    forEach(entries, items => {
        const grouping = items.group || 'default';

        let container = domQuery(`[data-group=${grouping}]`, entriesContainer);
        let content = domQuery('.djs-collapse-content', container);
        const header = domify(
            `<div class="djs-collapse-header iconfont open">${items.title}</div>`
        );

        if (!container) {
            container = domify(`<div class="group" data-group="${grouping}"></div>`);
            content = domify('<div class="djs-collapse-content open"></div>');
            container.appendChild(header);
            container.appendChild(content);
            entriesContainer.appendChild(container);
        }

        // 如果不存在children，则不显示该菜单项
        if (items.children != null && items.children.length === 0) {
            const containerClass = domClasses(container);
            containerClass.add('hidden');
        }

        forEach(items.children, entry => {
            const html =
                entry.html ||
                (entry.separator
                    ? '<hr class="separator" />'
                    : '<div class="entry" draggable="true"></div>');

            const control = domify(html);
            const icon = domify(`<i class="content-icon ${entry.className}"></i>`);
            const label = domify(`<span class="content-label">${entry.title}</span>`);
            control.appendChild(icon);
            control.appendChild(label);
            content.appendChild(control);

            if (!entry.separator) {
                domAttr(control, 'data-action', entry.id);

                if (entry.title) {
                    domAttr(control, 'title', entry.title);
                }

                if (entry.imageUrl) {
                    icon.appendChild(domify(`<img src="${entry.imageUrl}">`));
                }
            }
        });
    });

    // open after update
    this.open();
};

/**
 * Trigger an action available on the palette
 *
 * @param  {String} action
 * @param  {Event} event
 */
Palette.prototype.trigger = function(action, event, autoActivate) {
    const entries = this._entries;
    let entry;
    const button = event.delegateTarget || event.target;

    if (!button) {
        return event.preventDefault();
    }

    forEach(entries, items => {
        forEach(items.children, item => {
            if (item.id === domAttr(button, 'data-action')) {
                entry = item;
            }
        });
    });

    // when user clicks on the palette and not on an action
    if (!entry) {
        return;
    }

    const handler = entry.action;
    const originalEvent = event.originalEvent || event;

    // simple action (via callback function)
    if (isFunction(handler)) {
        if (action === 'click') {
            handler(originalEvent, autoActivate);
        }
    } else if (handler[action]) {
        handler[action](originalEvent, autoActivate);
    }

    // silence other actions
    event.preventDefault();
};

Palette.prototype._layoutChanged = function() {
    this._toggleState({});
};

/**
 * Do we need to collapse to two columns?
 *
 * @param {Number} availableHeight
 * @param {Object} entries
 *
 * @return {Boolean}
 */
Palette.prototype._needsCollapse = (availableHeight, entries) => {
    // top margin + bottom toggle + bottom margin
    // implementors must override this method if they
    // change the palette styles
    const margin = 20 + 10 + 20;

    const entriesHeight = Object.keys(entries).length * 46;

    return availableHeight < entriesHeight + margin;
};

/**
 * Close the palette
 */
Palette.prototype.close = function() {
    this._toggleState({
        open: false,
        twoColumn: false,
    });
};

/**
 * Open the palette
 */
Palette.prototype.open = function() {
    this._toggleState({open: true});
};

// 伸缩菜单
Palette.prototype.toggle = target => {
    const group = domClosest(target, '.group');
    const content = domQuery('.djs-collapse-content', group);
    const contentClasses = domClasses(content);
    const headerClasses = domClasses(target);
    const isOpen = contentClasses.has('open');
    if (isOpen) {
        contentClasses.remove('open');
        headerClasses.remove('open');
    } else {
        contentClasses.add('open');
        headerClasses.add('open');
    }
};

// 伸缩左侧栏
Palette.prototype.slide = function(target) {
    const containerClasses = domClasses(this._container);
    const isRetract = containerClasses.has('retract');
    if (isRetract) {
        containerClasses.remove('retract');
        target.setAttribute('title', '收起');
    } else {
        containerClasses.add('retract');
        target.setAttribute('title', '展开');
    }
};

Palette.prototype.isActiveTool = tool => {
    return tool && this._activeTool === tool;
};

Palette.prototype.updateToolHighlight = function(name) {
    let entriesContainer;

    if (!this._toolsContainer) {
        entriesContainer = domQuery('.djs-palette-entries', this._container);
        this._toolsContainer = domQuery('[data-group=tools]', entriesContainer);
    }
    const toolsContainer = this._toolsContainer;
    forEach(toolsContainer.children, tool => {
        let actionName = tool.getAttribute('data-action');

        if (!actionName) {
            return;
        }

        const toolClasses = domClasses(tool);

        actionName = actionName.replace('-tool', '');

        if (toolClasses.contains('entry') && actionName === name) {
            toolClasses.add('highlighted-entry');
        } else {
            toolClasses.remove('highlighted-entry');
        }
    });
};

/**
 * Return true if the palette is opened.
 *
 * @example
 *
 * palette.open();
 *
 * if (palette.isOpen()) {
 *   // yes, we are open
 * }
 *
 * @return {boolean} true if palette is opened
 */
Palette.prototype.isOpen = function() {
    return domClasses(this._container).has(PALETTE_OPEN_CLS);
};

/**
 * Get container the palette lives in.
 *
 * @return {Element}
 */
Palette.prototype._getParentContainer = function() {
    return this._canvas.getContainer();
};

/* markup definition */
Palette.HTML_MARKUP = `<div class="djs-palette">
    <div class="djs-palette-entries"></div>
    <div class="djs-palette-toggle iconfont" title="收起"></div>
  </div>`;
