import { Comment as Si, Text as Xu, Fragment as de, useSlots as ke, ref as U, computed as k, provide as Qr, createElementBlock as S, openBlock as m, createElementVNode as p, createCommentVNode as E, mergeProps as I, createBlock as x, withDirectives as me, resolveDynamicComponent as he, renderSlot as b, createTextVNode as V, vShow as Ie, isRef as Ku, inject as Mn, unref as q, withCtx as g, toDisplayString as ne, normalizeClass as te, mergeModels as Re, useModel as Me, onMounted as ir, watch as _e, resolveComponent as M, createVNode as P, renderList as we, normalizeProps as H, guardReactiveProps as ee, vModelRadio as Ko, getCurrentScope as ec, onScopeDispose as tc, nextTick as Xn, readonly as Ii, getCurrentInstance as Oi, toRef as nc, customRef as rc, shallowRef as lr, defineComponent as Fs, toValue as Je, watchEffect as oc, createSlots as ac, useTemplateRef as Ke, vModelDynamic as Ei, vModelCheckbox as sc, vModelSelect as ic, vModelText as lc, reactive as uc, withModifiers as Lo, useAttrs as Di, normalizeStyle as cc } from "vue";
function L(e) {
  return Array.isArray(e) && e.length > 0;
}
function F(e, { trim: t = !1 } = {}) {
  return typeof e != "string" ? !1 : t === !0 ? e.trim().length > 0 : e.length > 0;
}
function it(e) {
  return typeof e == "object" && !Array.isArray(e) && e !== null;
}
function oe(e) {
  return it(e) && Object.keys(e).length > 0;
}
function ct(e) {
  return typeof e == "function";
}
function Vs(e, { trim: t = !0 } = {}) {
  if (!e || typeof e != "function")
    return "";
  const n = e();
  return L(n) ? Ti(n, { trim: t }) : "";
}
function Ti(e, { trim: t = !0 } = {}) {
  if (!L(e))
    return "";
  let n = "";
  return e.forEach((r) => {
    if (r.type !== Si)
      if (F(r.children)) {
        n += r.children;
        return;
      } else Array.isArray(r.children) && r.children.length && (n += Ti(r.children, { trim: t }));
  }), t && (n = n.trim()), n;
}
function ue(e) {
  return !e || typeof e != "function" ? !1 : !Ni(e());
}
function Ni(e) {
  return L(e) ? e.every((t) => !!(!oe(t) || t.type === Si || t.type === Xu && !t.children.trim() || t.type === de && Ni(t.children))) : !0;
}
function ae(e, t, ...n) {
  if (!it(e))
    return;
  const r = e == null ? void 0 : e[t];
  if (!(!F(t) || !ct(r)))
    return e[t](...n), !0;
}
function wt(e) {
  return L(e) ? e.length : 0;
}
function ji(e) {
  return oe(e) ? Object.keys(e).length : 0;
}
function pe(e) {
  return typeof e == "number" && !isNaN(e);
}
function Ir(e) {
  return typeof e == "string" ? e.length : pe(e) ? e : L(e) ? wt(e) : oe(e) ? ji(e) : 0;
}
function Eo(e, t, n) {
  let r = t;
  switch (!0) {
    case t === "string":
    case t === "boolean":
      r = (o) => typeof o === t;
      break;
    case t === "number":
      r = pe;
      break;
    case t === "function":
      r = ct;
      break;
    case t === "array":
      r = Array.isArray;
      break;
    case t === "object":
      r = it;
      break;
  }
  return ct(r) && r(e) === !0 ? e : n;
}
function Q(e, t, n = null) {
  return !oe(e) || !F(t) ? n : t.split(".").reduce((r, o) => oe(r) && Object.hasOwn(r, o) ? r[o] : n, e);
}
function ea(e) {
  if (L(e)) {
    for (let t = 0; t < e.length; t++)
      if (e[t] !== void 0)
        return e[t];
  }
}
function Uo(e, t, { reverse: n = !1, wrap: r = !1 } = {}) {
  if (!pe(e) || !L(t))
    return 0;
  const o = t.length;
  if (n ? e-- : e++, r) {
    let a = !1;
    return e < 0 && (a = !0, e = Math.abs(e)), e >= o && (e = e % o), a && (e = o - e), e;
  } else {
    if (e < 0)
      return 0;
    if (e >= o)
      return o - 1;
  }
  return e;
}
function ta(e) {
  if (L(e))
    return e[0];
}
function dc(e, t) {
  return !L(e) || !F(t) ? [] : e.reduce((n, r) => (oe(r) && n.push(r[t]), n), []);
}
function fc(e, t, { ascending: n = !0 } = {}) {
  if (!L(e) || !F(t))
    return e;
  const r = n ? 1 : -1;
  return e.sort((o, a) => {
    const s = Q(o, t), i = Q(a, t);
    return s == null && i == null ? 0 : s == null ? -1 : i == null ? 1 : typeof s != "string" && typeof s != "number" || typeof i != "string" && typeof i != "number" ? 0 : s < i ? -r : s > i ? r : 0;
  });
}
const pc = { "data-test": "accordion-group" }, mc = { class: "inline-flex items-center gap-2" }, hc = { class: "divide-y divide-grey-200" }, vc = {
  __name: "accordion-group",
  props: {
    /**
     * The heading level to use for all panels.
     */
    headingLevel: {
      type: String,
      default: "h2"
    }
  },
  setup(e) {
    const t = e, n = ke(), r = U([]), o = k(() => Vs(n["show-panel-label"])), a = k(() => Vs(n["hide-panel-label"])), s = k(() => r.value.every((d) => d.isVisible === !0)), i = k(() => s.value ? "icon-chevron-up-circled" : "icon-chevron-down-circled");
    function l({ isVisible: d, show: h, hide: v }) {
      !Ku(d) || !ct(h) || !ct(v) || r.value.push({ isVisible: d, show: h, hide: v });
    }
    function u() {
      if (s.value) {
        f();
        return;
      }
      c();
    }
    function c() {
      if (L(r.value))
        for (const d of r.value)
          ae(d, "show");
    }
    function f() {
      if (L(r.value))
        for (const d of r.value)
          ae(d, "hide");
    }
    return Qr("accordion-group", {
      registerPanel: l,
      headingLevel: t.headingLevel,
      showPanelLabel: o,
      hidePanelLabel: a
    }), (d, h) => (m(), S("div", pc, [
      p("button", I({
        type: "button",
        class: "inline-flex items-center gap-2 text-purple-800 hocus:underline dark:text-purple-300"
      }, { "aria-expanded": s.value }, {
        "data-test": "accordion-group-button",
        onClick: u
      }), [
        (m(), x(he(i.value), { class: "size-text" })),
        me(p("span", null, [
          b(d.$slots, "show-all-panels-label", {}, () => [
            h[0] || (h[0] = V(" Show all panels "))
          ])
        ], 512), [
          [Ie, !s.value]
        ]),
        me(p("span", mc, [
          b(d.$slots, "hide-all-panels-label", {}, () => [
            h[1] || (h[1] = V(" Hide all panels "))
          ])
        ], 512), [
          [Ie, s.value]
        ])
      ], 16),
      p("div", hc, [
        b(d.$slots, "default")
      ]),
      E("", !0),
      E("", !0)
    ]));
  }
}, gc = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let ln = (e = 21) => {
  let t = "", n = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    t += gc[n[e] & 63];
  return t;
};
const yc = { "data-test": "accordion-panel" }, bc = { class: "mb-1 text-2xl font-bold text-grey-950" }, _c = { class: "mb-2" }, wc = {
  key: 0,
  class: "sr-only"
}, kc = { class: "inline-flex items-center gap-2 text-purple-800 group-hocus:underline dark:text-purple-300" }, $c = { class: "inline-flex items-center gap-2" }, Cc = { class: "inline-flex items-center gap-2" }, xc = {
  __name: "accordion-panel",
  setup(e) {
    const { registerPanel: t, headingLevel: n, showPanelLabel: r, hidePanelLabel: o } = Mn("accordion-group"), a = ke(), s = ln(), i = U(!1), l = k(() => i.value ? "icon-chevron-up-circled" : "icon-chevron-down-circled"), u = k(() => ue(a.introduction));
    t({
      isVisible: i,
      show: c,
      hide: f
    });
    function c() {
      i.value = !0;
    }
    function f() {
      i.value = !1;
    }
    function d() {
      if (i.value) {
        f();
        return;
      }
      c();
    }
    return (h, v) => (m(), S("div", yc, [
      (m(), x(he(q(n)), {
        class: "py-6",
        "data-test": "accordion-panel-title"
      }, {
        default: g(() => [
          p("button", I({
            type: "button",
            class: "group flex flex-col items-start"
          }, { "aria-controls": q(s), "aria-expanded": i.value }, {
            "data-test": "accordion-panel-button",
            onClick: d
          }), [
            p("span", bc, [
              b(h.$slots, "title")
            ]),
            v[0] || (v[0] = p("span", { class: "sr-only" }, ", ", -1)),
            p("span", _c, [
              b(h.$slots, "introduction")
            ]),
            u.value ? (m(), S("span", wc, ", ")) : E("", !0),
            p("div", kc, [
              (m(), x(he(l.value), { class: "size-text" })),
              me(p("span", $c, [
                b(h.$slots, "show-panel-label", {}, () => [
                  V(ne(q(r)), 1)
                ])
              ], 512), [
                [Ie, !i.value]
              ]),
              me(p("span", Cc, [
                b(h.$slots, "hide-panel-label", {}, () => [
                  V(ne(q(o)), 1)
                ])
              ], 512), [
                [Ie, i.value]
              ])
            ])
          ], 16)
        ]),
        _: 3
      })),
      p("div", I({ id: q(s), hidden: i.value ? null : "until-found" }, {
        class: { "pb-6": i.value },
        "data-test": "accordion-panel-content"
      }), [
        b(h.$slots, "default")
      ], 16)
    ]));
  }
}, Mc = {
  key: 0,
  class: "mt-1"
}, Sc = { class: "flex flex-col" }, Ic = "muted", Oc = {
  __name: "alert-message",
  props: {
    /**
     * The type of message, one of "success", "error", "warning", "info", or the
     * default, "muted".
     */
    type: {
      type: String,
      default: "muted"
    },
    /**
     * Whether to show a provided icon, especially useful for the alert types
     * that have an icon by default.
     */
    showIcon: {
      type: Boolean,
      default: !0
    },
    /**
     * The tag to use for the title.
     */
    titleTag: {
      type: String,
      default: "h3"
    }
  },
  setup(e) {
    const t = e, n = ["success", "error", "warning", "info", "muted"], r = ke(), o = k(() => n.includes(t.type) ? t.type : Ic), a = k(() => {
      switch (o.value) {
        case "success":
          return "border-green-200 bg-green-50 text-green-800 dark:border-transparent dark:bg-green-500/50 dark:text-green-200";
        case "error":
          return "border-red-200 bg-red-50 text-red-800 dark:border-transparent dark:bg-red-500/50 dark:text-red-200";
        case "warning":
          return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-transparent dark:bg-yellow-500/50 dark:text-yellow-200";
        case "info":
          return "border-purple-200 bg-purple-50 text-purple-800 dark:border-transparent dark:bg-purple-500/50 dark:text-purple-200";
        default:
          return "border-grey-200 bg-grey-50 text-grey-800 dark:border-transparent dark:bg-grey-500/50 dark:text-grey-200";
      }
    }), s = k(() => ue(r.icon)), i = k(() => t.showIcon && (o.value !== "muted" || s.value)), l = k(() => {
      switch (o.value) {
        case "success":
          return "icon-check-circled";
        case "error":
          return "icon-danger";
        case "warning":
          return "icon-warning";
        case "info":
          return "icon-info";
      }
      return null;
    }), u = k(() => ue(r.title));
    return (c, f) => (m(), S("div", {
      class: te(["flex w-full gap-3 rounded-sm border p-4", a.value]),
      role: "alert",
      "data-test": "alert-message"
    }, [
      i.value ? (m(), S("div", Mc, [
        b(c.$slots, "icon", {}, () => [
          (m(), x(he(l.value), { "data-test": "alert-message-icon" }))
        ])
      ])) : E("", !0),
      p("div", Sc, [
        u.value ? (m(), x(he(e.titleTag), {
          key: 0,
          class: "font-semibold",
          "data-test": "alert-message-title"
        }, {
          default: g(() => [
            b(c.$slots, "title")
          ]),
          _: 3
        })) : E("", !0),
        p("div", null, [
          b(c.$slots, "default")
        ])
      ])
    ], 2));
  }
};
function Wn(e) {
  return !isNaN(parseFloat(e)) && isFinite(e);
}
const Do = 0, As = 100;
function Ri(e, t = Do, n = As) {
  const r = Eo(e, pe, Do), o = Eo(t, pe, Do), a = Eo(n, pe, As);
  return r < o ? o : r > a ? a : r;
}
function Ec(e) {
  return F(e) ? new URLSearchParams(window.location.search).get(e) : null;
}
function Dc(e, t) {
  if (!F(e))
    return;
  const n = new URL(window.location.href);
  t === null ? n.searchParams.delete(e) : n.searchParams.set(e, t), window.history.replaceState(null, "", n);
}
const Tc = ["aria-label"], Nc = { class: "flex items-center" }, jc = {
  key: 0,
  class: "button",
  "data-test": "app-pagination-summary"
}, Rc = ["onClick"], Fc = { class: "sr-only" }, Vc = { "aria-hidden": "true" }, Ac = {
  key: 1,
  class: "button",
  "data-test": "app-pagination-summary"
}, Pc = {
  class: "ms-auto",
  "data-test": "app-pagination-showing-items-label"
}, Bc = {
  __name: "app-pagination",
  props: /* @__PURE__ */ Re({
    /**
     * The number of items in the paginated collection.
     */
    count: {
      type: Number,
      default: 0
    },
    // i18n
    /**
     * The label for the pagination, intended to explain to screen reader users
     * the purpose of the navigation.
     */
    label: {
      type: String,
      default: "Pagination"
    }
  }, {
    modelValue: {
      type: Number,
      default: 1
    },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Re(["@update:page"], ["update:modelValue"]),
  setup(e, { emit: t }) {
    const n = e, r = t, o = k(() => F(n.label)), a = U(10), s = Me(e, "modelValue"), i = k(() => !pe(n.count) || n.count <= 0 || !pe(a.value) ? 1 : Math.ceil(n.count / a.value)), l = k(() => i.value === 1), u = k(() => s.value > 3 && i.value > 4), c = k(() => s.value < i.value - 2 && i.value > 4), f = k(() => s.value == 1), d = k(() => s.value == i.value), h = k(() => {
      if (f.value) {
        const $ = [1, 2];
        return i.value > 2 && $.push(3), i.value > 3 && $.push(i.value), $;
      }
      if (d.value) {
        const $ = [i.value];
        return i.value > 1 && $.unshift(i.value - 1), i.value > 2 && $.unshift(i.value - 2), i.value > 3 && $.unshift(1), $;
      }
      const C = [1];
      return s.value > 2 && C.push(s.value - 1), C.push(s.value), s.value < i.value - 1 && C.push(s.value + 1), C.push(i.value), C;
    }), v = k(() => (s.value - 1) * a.value + 1), w = k(() => Math.min(v.value + a.value - 1, n.count));
    ir(() => {
      const C = parseInt(Ec("page"));
      !pe(C) || C <= 0 || C > i.value || (s.value = C);
    });
    function y() {
      s.value = Math.max(s.value - 1, 1);
    }
    function _() {
      s.value = Math.min(s.value + 1, i.value);
    }
    return _e(s, () => {
      r("@update:page", s.value), s.value >= 1 && Dc("page", s.value);
    }, { immediate: !0 }), _e(() => n.count, () => {
      s.value = 1;
    }), (C, $) => {
      const O = M("alert-message"), N = M("icon-arrow-left"), j = M("icon-arrow-right");
      return o.value ? l.value ? E("", !0) : (m(), S("nav", {
        key: 1,
        "aria-label": e.label,
        class: "flex flex-wrap items-center gap-4 text-center",
        "data-test": "app-pagination"
      }, [
        p("button", I({
          class: ["button flex items-center gap-2", { "text-grey-500": f.value, "underline hocus:bg-grey-200 hocus:text-grey-700": !f.value }]
        }, { disabled: f.value ? "disabled" : null, "aria-hidden": f.value ? "true" : null }, {
          "data-test": "app-pagination-previous",
          onClick: y
        }), [
          P(N),
          b(C.$slots, "previous-page-label", {}, () => [
            $[2] || ($[2] = V(" Previous "))
          ])
        ], 16),
        p("ul", Nc, [
          (m(!0), S(de, null, we(h.value, (R) => (m(), S(de, { key: R }, [
            R === i.value && c.value ? (m(), S("li", jc, " ⋯ ")) : E("", !0),
            p("li", I({ "data-test": "app-pagination-page" }, { ref_for: !0 }, { "aria-current": R === s.value ? "page" : null }), [
              p("button", {
                class: te(["button underline hocus:decoration-2", { "hocus:bg-grey-200 hocus:text-grey-700": R !== s.value, "bg-purple-800 text-white": R === s.value }]),
                "data-test": "app-pagination-page-button",
                onClick: (Z) => s.value = R
              }, [
                p("span", Fc, [
                  b(C.$slots, "page-number-label", I({ ref_for: !0 }, { page: R }), () => [
                    V(" Page " + ne(R), 1)
                  ])
                ]),
                p("span", Vc, ne(R), 1)
              ], 10, Rc)
            ], 16),
            R === 1 && u.value ? (m(), S("li", Ac, " ⋯ ")) : E("", !0)
          ], 64))), 128))
        ]),
        p("button", I({
          class: ["button flex items-center gap-2", { "text-grey-500": d.value, "underline hocus:bg-grey-200 hocus:text-grey-700": !d.value }]
        }, { disabled: d.value ? "disabled" : null, "aria-hidden": d.value ? "true" : null }, {
          "data-test": "app-pagination-next",
          onClick: _
        }), [
          b(C.$slots, "next-page-label", {}, () => [
            $[3] || ($[3] = V(" Next "))
          ]),
          P(j)
        ], 16),
        p("span", Pc, [
          b(C.$slots, "showing-items-label", H(ee({ first: v.value, last: w.value, total: e.count })), () => [
            V(" Showing " + ne(v.value) + "–" + ne(w.value) + " of " + ne(e.count) + " items ", 1)
          ])
        ])
      ], 8, Tc)) : (m(), x(O, {
        key: 0,
        type: "error"
      }, {
        title: g(() => $[0] || ($[0] = [
          V(" <app-pagination> ")
        ])),
        default: g(() => [
          $[1] || ($[1] = V(" A `label` is required for accessibility purposes. "))
        ]),
        _: 1,
        __: [1]
      }));
    };
  }
}, Lc = {
  class: "breadcrumb-item",
  "data-test": "breadcrumb-item"
}, Uc = {
  __name: "breadcrumb-item",
  props: {
    /**
     * The link for this item.
     */
    href: {
      type: String,
      required: !0
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("icon-chevron-right");
      return m(), S("li", Lc, [
        p("a", I({ href: e.href }, { class: "flex items-center gap-2 text-current" }), [
          P(r, { class: "breadcrumb-divider size-3" }),
          b(t.$slots, "default")
        ], 16)
      ]);
    };
  }
}, Zc = ["aria-label"], Yc = {
  class: "flex items-center gap-2",
  "data-test": "breadcrumb-list-list"
}, qc = {
  __name: "breadcrumb-list",
  props: {
    // i18n
    /**
     * The label for the breadcrumbs, intended to explain to screen reader users
     * the purpose of the navigation.
     */
    label: {
      type: String,
      default: "Breadcrumb"
    }
  },
  setup(e) {
    const t = e, n = k(() => F(t.label));
    return (r, o) => {
      const a = M("alert-message");
      return n.value ? (m(), S("nav", {
        key: 1,
        "aria-label": e.label,
        "data-test": "breadcrumb-list"
      }, [
        p("ol", Yc, [
          b(r.$slots, "default")
        ])
      ], 8, Zc)) : (m(), x(a, {
        key: 0,
        type: "error"
      }, {
        title: g(() => o[0] || (o[0] = [
          V(" <breadcrumb-list> ")
        ])),
        default: g(() => [
          o[1] || (o[1] = V(" A `label` is required for accessibility purposes. "))
        ]),
        _: 1,
        __: [1]
      }));
    };
  }
}, zc = {
  inheritAttrs: !1
}, kt = /* @__PURE__ */ Object.assign(zc, {
  __name: "form-label",
  props: {
    /**
     * The tag to use for the label. Useful when using a label as a legend, for
     * example.
     */
    tag: {
      type: String,
      default: "label"
    },
    /**
     * The ID of the input that this label belongs to.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Whether the field this label belongs to is required. If not, the label is
     * augmented with `optional` text.
     */
    required: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether this label is visually hidden. Labels are never hidden from
     * screen readers because of the value they provide.
     */
    hidden: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to apply styling to the label. This is most useful when using the
     * label for things like radio labels, where the styling is different.
     */
    styled: {
      type: Boolean,
      default: !0
    }
  },
  setup(e) {
    const t = e, n = ke(), r = k(() => ue(n.default)), o = k(() => t.tag === "label" && !F(t.id));
    return (a, s) => {
      const i = M("alert-message");
      return m(), S(de, null, [
        r.value ? E("", !0) : (m(), x(i, {
          key: 0,
          type: "error",
          "data-test": "form-label-no-label"
        }, {
          title: g(() => s[0] || (s[0] = [
            V(" <form-label> ")
          ])),
          default: g(() => [
            s[1] || (s[1] = V(" A label is required for accessibility purposes. "))
          ]),
          _: 1,
          __: [1]
        })),
        o.value ? (m(), x(i, {
          key: 1,
          type: "error",
          "data-test": "form-label-no-id"
        }, {
          title: g(() => s[2] || (s[2] = [
            V(" <form-label> ")
          ])),
          default: g(() => [
            s[3] || (s[3] = V(" An ID for the corresponding input is required when using the tag `label`. "))
          ]),
          _: 1,
          __: [3]
        })) : E("", !0),
        (m(), x(he(e.tag), I({ for: e.id, ...a.$attrs }, {
          class: { "sr-only": e.hidden, "font-semibold text-grey-950 dark:text-grey-50": e.styled },
          "data-test": "form-label"
        }), {
          default: g(() => [
            b(a.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"]))
      ], 64);
    };
  }
}), Wc = {
  __name: "button-group",
  props: {
    modelValue: {
      type: [String, Number]
    },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = Me(e, "modelValue"), r = U([]), o = U(null);
    function a() {
      if (!L(r.value))
        return;
      const i = o.value.querySelector(":checked");
      if (i) {
        ae(i, "focus");
        return;
      }
      s();
    }
    function s() {
      const i = ta(r.value);
      ae(i, "focus");
    }
    return t({
      triggerFocus: a
    }), (i, l) => {
      const u = M("form-radio-group");
      return m(), x(u, { "data-test": "button-group" }, {
        options: g(({ options: c, name: f }) => [
          b(i.$slots, "options", H(ee({ options: c, name: f })), () => [
            p("div", {
              ref_key: "optionsWrapperElement",
              ref: o,
              class: "flex mt-1"
            }, [
              (m(!0), S(de, null, we(c, (d) => (m(), S("div", {
                key: d.id
              }, [
                me(p("input", I({
                  ref_for: !0,
                  ref_key: "inputReferences",
                  ref: r,
                  "onUpdate:modelValue": l[0] || (l[0] = (h) => n.value = h),
                  type: "radio",
                  class: "peer sr-only"
                }, { ref_for: !0 }, { id: d.id, value: d.value, name: f }), null, 16), [
                  [Ko, n.value]
                ]),
                P(kt, I({ ref_for: !0 }, { id: d.id, styled: !1 }, {
                  class: ["button-group flex items-center gap-2", {
                    "button-group--middle": !d.first,
                    "button-group--first": d.first,
                    "button-group--last": d.last
                  }]
                }), {
                  default: g(() => [
                    d.icon ? (m(), x(he(d.icon), { key: 0 })) : E("", !0),
                    V(" " + ne(d.label), 1)
                  ]),
                  _: 2
                }, 1040, ["class"])
              ]))), 128))
            ], 512)
          ])
        ]),
        introduction: g(() => [
          b(i.$slots, "introduction")
        ]),
        error: g(() => [
          b(i.$slots, "error")
        ]),
        help: g(() => [
          b(i.$slots, "help")
        ]),
        default: g(() => [
          b(i.$slots, "default")
        ]),
        _: 3
      });
    };
  }
}, Hc = {
  inheritAttrs: !1
}, Gc = /* @__PURE__ */ Object.assign(Hc, {
  __name: "conditional-wrapper",
  props: {
    /**
     * Whether to wrap the contents.
     */
    wrap: {
      type: Boolean,
      default: !0
    },
    /**
     * The tag to wrap with, if wrapping is active.
     */
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(e) {
    return (t, n) => e.wrap ? (m(), x(he(e.tag), H(I({ key: 0 }, t.$attrs)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16)) : b(t.$slots, "default", { key: 1 });
  }
}), Jc = {
  key: 0,
  class: "absolute inset-0 flex gap-1 items-center justify-center animate-fade-in",
  "data-test": "copy-content-success"
}, Qc = {
  key: 1,
  class: "absolute inset-0 flex gap-1 items-center justify-center animate-fade-in",
  "data-test": "copy-content-error"
}, Xc = {
  __name: "copy-content",
  props: {
    /**
     * The content to copy when the button is activated.
     */
    content: {
      type: String,
      required: !0
    }
  },
  setup(e) {
    const t = e, n = U(!1), r = U(!1);
    async function o() {
      if (!F(t.content)) {
        s(), console.error("copy-content[copyContent]: No content to copy");
        return;
      }
      try {
        await navigator.clipboard.writeText(t.content), a();
      } catch (l) {
        console.error("copy-content[copyContent]: Failed to copy content", l), s();
      }
    }
    function a() {
      i(n);
    }
    function s() {
      i(r);
    }
    function i(l) {
      l.value = !0, setTimeout(() => {
        l.value = !1;
      }, 2e3);
    }
    return (l, u) => {
      var v;
      const c = M("icon-clipboard"), f = M("icon-check-circled"), d = M("icon-danger"), h = M("ui-button");
      return m(), x(h, {
        class: te({ relative: !((v = l.$attrs.class) != null && v.includes("absolute")) }),
        "data-test": "copy-content",
        onClick: o
      }, {
        default: g(() => [
          p("span", {
            class: te(["flex gap-2 items-center transition-opacity", { "opacity-0": n.value || r.value }]),
            "data-test": "copy-content-label"
          }, [
            P(c),
            b(l.$slots, "default", {}, () => [
              u[0] || (u[0] = V(" Copy "))
            ])
          ], 2),
          n.value ? (m(), S("span", Jc, [
            P(f),
            b(l.$slots, "copy-success-label", {}, () => [
              u[1] || (u[1] = V(" Copied "))
            ])
          ])) : E("", !0),
          r.value ? (m(), S("span", Qc, [
            P(d),
            b(l.$slots, "copy-error-label", {}, () => [
              u[2] || (u[2] = V(" Error "))
            ])
          ])) : E("", !0)
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
};
function Fi(e) {
  if (!e || typeof e != "object")
    return e;
  const t = Array.isArray(e) ? [] : {};
  for (const n in e)
    Object.hasOwn(e, n) && (t[n] = Fi(e[n]));
  return t;
}
function Gn(e, ...t) {
  if (!L(t))
    return e;
  const n = t.shift();
  if (!it(e) || !it(n))
    return Gn(e, ...t);
  const r = { ...e };
  for (const o in n)
    Kc(r[o], n[o]) ? r[o] = n[o] : it(n[o]) ? (r[o] || (r[o] = {}), r[o] = Gn(r[o], n[o])) : r[o] = n[o];
  return Gn(r, ...t);
}
function Kc(e, t) {
  return typeof e != typeof t || Array.isArray(e) !== Array.isArray(t) || it(e) !== it(t);
}
function rn(e) {
  return oe(e) ? Object.keys(e) : [];
}
function Vi(e, t, { exclude: n = null, include: r = null, caseInsensitive: o = !0, allowPartial: a = !1 } = {}) {
  if (!oe(e) && !L(e))
    return !1;
  if (L(e))
    return e.some((i) => Ps(i, t, { caseInsensitive: o, allowPartial: a }));
  let s;
  return L(r) ? s = Object.keys(e).filter((i) => r.includes(i)).map((i) => e[i]) : L(n) ? s = Object.keys(e).filter((i) => !n.includes(i)).map((i) => e[i]) : s = Object.values(e), s.some((i) => Ps(i, t, { caseInsensitive: o, allowPartial: a }));
}
function Ps(e, t, { caseInsensitive: n = !0, allowPartial: r = !1 } = {}) {
  if (oe(e) || L(e))
    return Vi(e, t, { caseInsensitive: n, allowPartial: r });
  if (typeof t == "string") {
    if (typeof e != "string")
      return !1;
    if (n === !0 && (t = t.toLowerCase(), e = e.toLowerCase()), r === !0)
      return e.includes(t);
  }
  return e === t;
}
function ed(e) {
  return !oe(e) || ji(e) > 1 ? null : Q(e, ea(rn(e)));
}
function na(e) {
  return ec() ? (tc(e), !0) : !1;
}
function td(e, t) {
  if (typeof Symbol < "u") {
    const n = { ...e };
    return Object.defineProperty(n, Symbol.iterator, {
      enumerable: !1,
      value() {
        let r = 0;
        return {
          next: () => ({
            value: t[r++],
            done: r > t.length
          })
        };
      }
    }), n;
  } else
    return Object.assign([...t], e);
}
const Ai = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const nd = (e) => e != null, rd = Object.prototype.toString, od = (e) => rd.call(e) === "[object Object]", Dt = () => {
}, ad = /* @__PURE__ */ sd();
function sd() {
  var e, t;
  return Ai && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window == null ? void 0 : window.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function id(...e) {
  if (e.length !== 1)
    return nc(...e);
  const t = e[0];
  return typeof t == "function" ? Ii(rc(() => ({ get: t, set: Dt }))) : U(t);
}
function ld(e, t) {
  function n(...r) {
    return new Promise((o, a) => {
      Promise.resolve(e(() => t.apply(this, r), { fn: t, thisArg: this, args: r })).then(o).catch(a);
    });
  }
  return n;
}
const Pi = (e) => e();
function ud(e = Pi, t = {}) {
  const {
    initialState: n = "active"
  } = t, r = id(n === "active");
  function o() {
    r.value = !1;
  }
  function a() {
    r.value = !0;
  }
  const s = (...i) => {
    r.value && e(...i);
  };
  return { isActive: Ii(r), pause: o, resume: a, eventFilter: s };
}
function Rr(e) {
  return Array.isArray(e) ? e : [e];
}
function cd(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}
const dd = /-(\w)/g, fd = cd((e) => e.replace(dd, (t, n) => n ? n.toUpperCase() : ""));
function pd(e) {
  return Oi();
}
function md(e, t, n = {}) {
  const {
    eventFilter: r = Pi,
    ...o
  } = n;
  return _e(
    e,
    ld(
      r,
      t
    ),
    o
  );
}
function hd(e, t, n = {}) {
  const {
    eventFilter: r,
    initialState: o = "active",
    ...a
  } = n, { eventFilter: s, pause: i, resume: l, isActive: u } = ud(r, { initialState: o });
  return { stop: md(
    e,
    t,
    {
      ...a,
      eventFilter: s
    }
  ), pause: i, resume: l, isActive: u };
}
function vd(e, t = !0, n) {
  pd() ? ir(e, n) : t ? e() : Xn(e);
}
function gd(e, t, n) {
  return _e(
    e,
    t,
    {
      ...n,
      immediate: !0
    }
  );
}
function yd(e = {}) {
  const {
    inheritAttrs: t = !0
  } = e, n = lr(), r = /* @__PURE__ */ Fs({
    setup(a, { slots: s }) {
      return () => {
        n.value = s.default;
      };
    }
  }), o = /* @__PURE__ */ Fs({
    inheritAttrs: t,
    props: e.props,
    setup(a, { attrs: s, slots: i }) {
      return () => {
        var l;
        if (!n.value && process.env.NODE_ENV !== "production")
          throw new Error("[VueUse] Failed to find the definition of reusable template");
        const u = (l = n.value) == null ? void 0 : l.call(n, {
          ...e.props == null ? bd(s) : a,
          $slots: i
        });
        return t && (u == null ? void 0 : u.length) === 1 ? u[0] : u;
      };
    }
  });
  return td(
    { define: r, reuse: o },
    [r, o]
  );
}
function bd(e) {
  const t = {};
  for (const n in e)
    t[fd(n)] = e[n];
  return t;
}
const $t = Ai ? window : void 0;
function Ft(e) {
  var t;
  const n = Je(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
function lt(...e) {
  const t = [], n = () => {
    t.forEach((i) => i()), t.length = 0;
  }, r = (i, l, u, c) => (i.addEventListener(l, u, c), () => i.removeEventListener(l, u, c)), o = k(() => {
    const i = Rr(Je(e[0])).filter((l) => l != null);
    return i.every((l) => typeof l != "string") ? i : void 0;
  }), a = gd(
    () => {
      var i, l;
      return [
        (l = (i = o.value) == null ? void 0 : i.map((u) => Ft(u))) != null ? l : [$t].filter((u) => u != null),
        Rr(Je(o.value ? e[1] : e[0])),
        Rr(q(o.value ? e[2] : e[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        Je(o.value ? e[3] : e[2])
      ];
    },
    ([i, l, u, c]) => {
      if (n(), !(i != null && i.length) || !(l != null && l.length) || !(u != null && u.length))
        return;
      const f = od(c) ? { ...c } : c;
      t.push(
        ...i.flatMap(
          (d) => l.flatMap(
            (h) => u.map((v) => r(d, h, v, f))
          )
        )
      );
    },
    { flush: "post" }
  ), s = () => {
    a(), n();
  };
  return na(n), s;
}
let Bs = !1;
function _d(e, t, n = {}) {
  const { window: r = $t, ignore: o = [], capture: a = !0, detectIframe: s = !1, controls: i = !1 } = n;
  if (!r)
    return i ? { stop: Dt, cancel: Dt, trigger: Dt } : Dt;
  if (ad && !Bs) {
    Bs = !0;
    const y = { passive: !0 };
    Array.from(r.document.body.children).forEach((_) => _.addEventListener("click", Dt, y)), r.document.documentElement.addEventListener("click", Dt, y);
  }
  let l = !0;
  const u = (y) => Je(o).some((_) => {
    if (typeof _ == "string")
      return Array.from(r.document.querySelectorAll(_)).some((C) => C === y.target || y.composedPath().includes(C));
    {
      const C = Ft(_);
      return C && (y.target === C || y.composedPath().includes(C));
    }
  });
  function c(y) {
    const _ = Je(y);
    return _ && _.$.subTree.shapeFlag === 16;
  }
  function f(y, _) {
    const C = Je(y), $ = C.$.subTree && C.$.subTree.children;
    return $ == null || !Array.isArray($) ? !1 : $.some((O) => O.el === _.target || _.composedPath().includes(O.el));
  }
  const d = (y) => {
    const _ = Ft(e);
    if (y.target != null && !(!(_ instanceof Element) && c(e) && f(e, y)) && !(!_ || _ === y.target || y.composedPath().includes(_))) {
      if ("detail" in y && y.detail === 0 && (l = !u(y)), !l) {
        l = !0;
        return;
      }
      t(y);
    }
  };
  let h = !1;
  const v = [
    lt(r, "click", (y) => {
      h || (h = !0, setTimeout(() => {
        h = !1;
      }, 0), d(y));
    }, { passive: !0, capture: a }),
    lt(r, "pointerdown", (y) => {
      const _ = Ft(e);
      l = !u(y) && !!(_ && !y.composedPath().includes(_));
    }, { passive: !0 }),
    s && lt(r, "blur", (y) => {
      setTimeout(() => {
        var _;
        const C = Ft(e);
        ((_ = r.document.activeElement) == null ? void 0 : _.tagName) === "IFRAME" && !(C != null && C.contains(r.document.activeElement)) && t(y);
      }, 0);
    }, { passive: !0 })
  ].filter(Boolean), w = () => v.forEach((y) => y());
  return i ? {
    stop: w,
    cancel: () => {
      l = !1;
    },
    trigger: (y) => {
      l = !0, d(y), l = !1;
    }
  } : w;
}
function wd() {
  const e = lr(!1), t = Oi();
  return t && ir(() => {
    e.value = !0;
  }, t), e;
}
function kd(e) {
  const t = wd();
  return k(() => (t.value, !!e()));
}
function $d(e, t, n = {}) {
  const { window: r = $t, ...o } = n;
  let a;
  const s = kd(() => r && "MutationObserver" in r), i = () => {
    a && (a.disconnect(), a = void 0);
  }, l = k(() => {
    const d = Je(e), h = Rr(d).map(Ft).filter(nd);
    return new Set(h);
  }), u = _e(
    () => l.value,
    (d) => {
      i(), s.value && d.size && (a = new MutationObserver(t), d.forEach((h) => a.observe(h, o)));
    },
    { immediate: !0, flush: "post" }
  ), c = () => a == null ? void 0 : a.takeRecords(), f = () => {
    u(), i();
  };
  return na(f), {
    isSupported: s,
    stop: f,
    takeRecords: c
  };
}
function Cd(e, t, n = {}) {
  const {
    window: r = $t,
    document: o = r == null ? void 0 : r.document,
    flush: a = "sync"
  } = n;
  if (!r || !o)
    return Dt;
  let s;
  const i = (c) => {
    s == null || s(), s = c;
  }, l = oc(() => {
    const c = Ft(e);
    if (c) {
      const { stop: f } = $d(
        o,
        (d) => {
          d.map((v) => [...v.removedNodes]).flat().some((v) => v === c || v.contains(c)) && t(d);
        },
        {
          window: r,
          childList: !0,
          subtree: !0
        }
      );
      i(f);
    }
  }, { flush: a }), u = () => {
    l(), i();
  };
  return na(u), u;
}
function xd(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function Bi(...e) {
  let t, n, r = {};
  e.length === 3 ? (t = e[0], n = e[1], r = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], r = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: o = $t,
    eventName: a = "keydown",
    passive: s = !1,
    dedupe: i = !1
  } = r, l = xd(t);
  return lt(o, a, (c) => {
    c.repeat && Je(i) || l(c) && n(c);
  }, s);
}
function Md(e = {}) {
  var t;
  const {
    window: n = $t,
    deep: r = !0,
    triggerOnRemoval: o = !1
  } = e, a = (t = e.document) != null ? t : n == null ? void 0 : n.document, s = () => {
    var u;
    let c = a == null ? void 0 : a.activeElement;
    if (r)
      for (; c != null && c.shadowRoot; )
        c = (u = c == null ? void 0 : c.shadowRoot) == null ? void 0 : u.activeElement;
    return c;
  }, i = lr(), l = () => {
    i.value = s();
  };
  if (n) {
    const u = {
      capture: !0,
      passive: !0
    };
    lt(
      n,
      "blur",
      (c) => {
        c.relatedTarget === null && l();
      },
      u
    ), lt(
      n,
      "focus",
      l,
      u
    );
  }
  return o && Cd(i, l, { document: a }), l(), i;
}
const Or = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Er = "__vueuse_ssr_handlers__", Sd = /* @__PURE__ */ Id();
function Id() {
  return Er in Or || (Or[Er] = Or[Er] || {}), Or[Er];
}
function Od(e, t) {
  return Sd[e] || t;
}
function Ed(e) {
  return e == null ? "any" : e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof Date ? "date" : typeof e == "boolean" ? "boolean" : typeof e == "string" ? "string" : typeof e == "object" ? "object" : Number.isNaN(e) ? "any" : "number";
}
const Dd = {
  boolean: {
    read: (e) => e === "true",
    write: (e) => String(e)
  },
  object: {
    read: (e) => JSON.parse(e),
    write: (e) => JSON.stringify(e)
  },
  number: {
    read: (e) => Number.parseFloat(e),
    write: (e) => String(e)
  },
  any: {
    read: (e) => e,
    write: (e) => String(e)
  },
  string: {
    read: (e) => e,
    write: (e) => String(e)
  },
  map: {
    read: (e) => new Map(JSON.parse(e)),
    write: (e) => JSON.stringify(Array.from(e.entries()))
  },
  set: {
    read: (e) => new Set(JSON.parse(e)),
    write: (e) => JSON.stringify(Array.from(e))
  },
  date: {
    read: (e) => new Date(e),
    write: (e) => e.toISOString()
  }
}, Ls = "vueuse-storage";
function Li(e, t, n, r = {}) {
  var o;
  const {
    flush: a = "pre",
    deep: s = !0,
    listenToStorageChanges: i = !0,
    writeDefaults: l = !0,
    mergeDefaults: u = !1,
    shallow: c,
    window: f = $t,
    eventFilter: d,
    onError: h = (G) => {
      console.error(G);
    },
    initOnMounted: v
  } = r, w = (c ? lr : U)(typeof t == "function" ? t() : t), y = k(() => Je(e));
  if (!n)
    try {
      n = Od("getDefaultStorage", () => {
        var G;
        return (G = $t) == null ? void 0 : G.localStorage;
      })();
    } catch (G) {
      h(G);
    }
  if (!n)
    return w;
  const _ = Je(t), C = Ed(_), $ = (o = r.serializer) != null ? o : Dd[C], { pause: O, resume: N } = hd(
    w,
    () => z(w.value),
    { flush: a, deep: s, eventFilter: d }
  );
  _e(y, () => Se(), { flush: a });
  let j = !1;
  const R = (G) => {
    v && !j || Se(G);
  }, Z = (G) => {
    v && !j || le(G);
  };
  f && i && (n instanceof Storage ? lt(f, "storage", R, { passive: !0 }) : lt(f, Ls, Z)), v ? vd(() => {
    j = !0, Se();
  }) : Se();
  function D(G, J) {
    if (f) {
      const $e = {
        key: y.value,
        oldValue: G,
        newValue: J,
        storageArea: n
      };
      f.dispatchEvent(n instanceof Storage ? new StorageEvent("storage", $e) : new CustomEvent(Ls, {
        detail: $e
      }));
    }
  }
  function z(G) {
    try {
      const J = n.getItem(y.value);
      if (G == null)
        D(J, null), n.removeItem(y.value);
      else {
        const $e = $.write(G);
        J !== $e && (n.setItem(y.value, $e), D(J, $e));
      }
    } catch (J) {
      h(J);
    }
  }
  function re(G) {
    const J = G ? G.newValue : n.getItem(y.value);
    if (J == null)
      return l && _ != null && n.setItem(y.value, $.write(_)), _;
    if (!G && u) {
      const $e = $.read(J);
      return typeof u == "function" ? u($e, _) : C === "object" && !Array.isArray($e) ? { ..._, ...$e } : $e;
    } else return typeof J != "string" ? J : $.read(J);
  }
  function Se(G) {
    if (!(G && G.storageArea !== n)) {
      if (G && G.key == null) {
        w.value = _;
        return;
      }
      if (!(G && G.key !== y.value)) {
        O();
        try {
          (G == null ? void 0 : G.newValue) !== $.write(w.value) && (w.value = re(G));
        } catch (J) {
          h(J);
        } finally {
          G ? Xn(N) : N();
        }
      }
    }
  }
  function le(G) {
    Se(G.detail);
  }
  return w;
}
const Td = "focusin", Nd = "focusout", jd = ":focus-within";
function Ui(e, t = {}) {
  const { window: n = $t } = t, r = k(() => Ft(e)), o = lr(!1), a = k(() => o.value), s = Md(t);
  if (!n || !s.value)
    return { focused: a };
  const i = { passive: !0 };
  return lt(r, Td, () => o.value = !0, i), lt(r, Nd, () => {
    var l, u, c;
    return o.value = (c = (u = (l = r.value) == null ? void 0 : l.matches) == null ? void 0 : u.call(l, jd)) != null ? c : !1;
  }, i), { focused: a };
}
const Rd = {
  class: "py-1",
  "data-test": "data-table-columns"
}, Fd = {
  __name: "data-table-columns",
  props: {
    modelValue: {
      type: Object
    },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const { tableName: t, haveTableName: n, columnDefinitions: r } = Mn("data-table"), o = n.value && Li(`data-table:${t.value}:columns`, {}), a = Me(e, "modelValue"), s = k(() => {
      const l = [];
      for (const u in r.value) {
        if (!Object.prototype.hasOwnProperty.call(r.value, u))
          return;
        const c = r.value[u];
        l.push({ key: u, label: c.label });
      }
      return l;
    });
    i();
    function i() {
      if (L(s.value)) {
        it(a.value) || (a.value = {});
        for (const l of s.value)
          a.value[l.key] = !0, Object.hasOwn(o.value, l.key) && (a.value[l.key] = o.value[l.key]);
        for (const l in a.value)
          s.value.find((u) => u.key === l) || delete a.value[l];
      }
    }
    return _e(a, () => {
      o.value = a.value;
    }, { deep: !0 }), (l, u) => {
      const c = M("dropdown-menu-checkbox");
      return m(), S("div", Rd, [
        (m(!0), S(de, null, we(s.value, (f) => (m(), x(c, {
          key: f.key,
          modelValue: a.value[f.key],
          "onUpdate:modelValue": (d) => a.value[f.key] = d,
          "data-test": "data-table-columns-checkbox"
        }, {
          default: g(() => [
            V(ne(f.label), 1)
          ]),
          _: 2
        }, 1032, ["modelValue", "onUpdate:modelValue"]))), 128))
      ]);
    };
  }
}, Vd = { "data-test": "data-table-density" }, Ad = {
  __name: "data-table-density",
  props: {
    modelValue: {
      type: String
    },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const { tableName: t, haveTableName: n, updateTableDensityOptions: r } = Mn("data-table"), o = n.value && Li(`data-table:${t.value}:density`, "relaxed"), a = Me(e, "modelValue"), s = U([
      { label: "Compact", value: "compact" },
      { label: "Standard", value: "standard" },
      { label: "Relaxed", value: "relaxed" }
    ]);
    r(s.value.map((l) => l.value)), n.value && (a.value = o.value);
    function i(l) {
      !F(l) || !s.value.map((c) => c.value).includes(l) || (o.value = l, a.value = l);
    }
    return (l, u) => {
      const c = M("dropdown-menu-button");
      return m(), S("div", Vd, [
        (m(!0), S(de, null, we(s.value, ({ label: f, value: d }) => (m(), x(c, I({
          key: d,
          ref_for: !0
        }, { iconStart: `icon-density-${d}`, selected: a.value === d }, {
          "data-test": `data-table-density-${d}`,
          onClick: (h) => i(d)
        }), {
          default: g(() => [
            b(l.$slots, `display-option-${d}-label`, {}, () => [
              V(ne(f), 1)
            ])
          ]),
          _: 2
        }, 1040, ["data-test", "onClick"]))), 128))
      ]);
    };
  }
}, Pd = {
  class: "flex items-end gap-4",
  "data-test": "data-table-search"
}, Bd = {
  __name: "data-table-search",
  props: {
    modelValue: {
      type: String
    },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const { searchPlaceholder: n } = Mn("data-table"), r = Me(e, "modelValue"), o = U(null), a = k(() => F(r.value));
    function s() {
      ae(o.value, "triggerFocus");
    }
    function i() {
      r.value = "", s();
    }
    return t({
      triggerFocus: s
    }), (l, u) => {
      const c = M("form-input"), f = M("ui-button");
      return m(), S("div", Pd, [
        P(c, I({
          ref_key: "searchQueryInput",
          ref: o
        }, { placeholder: q(n) }, {
          modelValue: r.value,
          "onUpdate:modelValue": u[0] || (u[0] = (d) => r.value = d),
          class: "w-full max-w-sm",
          "data-test": "data-table-search-input"
        }), {
          default: g(() => [
            b(l.$slots, "search-label", {}, () => [
              u[1] || (u[1] = V(" Search "))
            ])
          ]),
          _: 3
        }, 16, ["modelValue"]),
        me(P(f, {
          class: "button--muted",
          "data-test": "data-table-search-reset-button",
          onClick: i
        }, {
          default: g(() => [
            b(l.$slots, "reset-search-label", {}, () => [
              u[2] || (u[2] = V(" Reset search "))
            ])
          ]),
          _: 3
        }, 512), [
          [Ie, a.value]
        ])
      ]);
    };
  }
}, Ld = { "data-test": "data-table" }, Ud = {
  key: 0,
  class: "mb-6 flex flex-col gap-4 border-b border-grey-200 pb-6"
}, Zd = { class: "text-sm" }, Yd = {
  key: 1,
  class: "flex flex-col gap-6"
}, qd = {
  key: 0,
  class: "flex items-end gap-4"
}, zd = {
  class: "w-full",
  "data-test": "data-table-table"
}, Wd = { class: "sr-only" }, Hd = { class: "border-b border-grey-300" }, Gd = {
  key: 0,
  class: "w-px px-4"
}, Jd = {
  key: 0,
  class: "px-4"
}, Qd = {
  key: 1,
  class: "ps-4"
}, Xd = { class: "font-bold" }, Kd = {
  __name: "data-table",
  props: /* @__PURE__ */ Re({
    /**
     * The data to display in the table, modified by the `columns`
     * configuration.
     */
    data: {
      type: Array,
      default: () => []
    },
    /**
     * Any additional configuration for columns. Options are as defined in
     * `data-table.md`.
     *
     * **Note:** Columns without configuration will not be displayed. This is to
     * make it easier to hide unnecessary columns, and to help enforce proper
     * labelling of column data.
     */
    columns: {
      type: Object,
      default: () => ({})
    },
    /**
     * A unique name for this table. This will be used to store the user's
     * preferences for how dense the table is, for example. Without a name, this
     * option will not be available. The name will be used directly in
     * `localStorage`, prefixed with `data-table:`, so should be safe for users.
     */
    name: {
      type: String,
      default: null
    },
    /**
     * Whether to enable the table search. When enabled, anything typed into the
     * search box will search the text for each cell case-insensitively, and
     * hide any rows where none of the cells match.
     */
    enableSearch: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether to enable the table sort. When enabled, columns marked as
     * sortable (the default) can be ordered ascending or descending.
     */
    enableSort: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether to enable pagination. When enabled, visible rows are limited to
     * those on the currently selected page.
     */
    enablePagination: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether to enable selection. When enabled, a new column is added to the
     * start of the table to include selection checkboxes, and v-model on the
     * table returns the selected rows' data.
     */
    enableSelection: {
      type: Boolean,
      default: !1
    },
    /**
     * If defined, this method is called with a `columnKey` for the current
     * column, and `rowData` for the current row. This method is called as the
     * table is building up its internal content. If the method returns a
     * string, this is used as the searchable content for that column in that
     * row, **overriding** the content of the cell. If anything else is
     * returned, such as undefined, the original content is used instead.
     */
    searchableContentCallback: {
      type: Function,
      default: null
    },
    /**
     * If defined, this method is called with a `columnKey` for the current
     * column, and `rowData` for the current row. This method is called as the
     * table is building up its internal content. If the method returns a
     * string, this is used as the sortable content for that column in that row,
     * **overriding** the content of the cell. If anything else is returned,
     * such as undefined, the original content is used instead.
     *
     * The returned content is used in a `sort` method, so the returned content
     * should make sense when sorted in that way.
     */
    sortableContentCallback: {
      type: Function,
      default: null
    },
    /**
     * The placeholder to apply to the search input.
     */
    searchPlaceholder: {
      type: String,
      default: null
    },
    /**
     * The heading level to use for any introduction to this table.
     */
    headingLevel: {
      type: String,
      default: "h2"
    },
    /**
     * Classes to apply to all headings in the table. Cell padding will always
     * apply.
     */
    headingClasses: {
      type: String,
      default: "text-left font-bold text-grey-950"
    },
    /**
     * Classes to apply to all standard cells in the table. Cell padding will
     * always apply.
     */
    cellClasses: {
      type: String,
      default: "text-grey-500"
    }
  }, {
    modelValue: {
      type: Array
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = Me(e, "modelValue"), o = ke(), a = U(null), s = U(""), i = k(() => F(s.value)), l = U(null), u = U(1), c = U(1), f = k(() => F(n.name)), d = k(() => f.value), h = k(() => ue(o.caption)), v = k(() => ue(o["table-title"])), w = k(() => ue(o["table-introduction"])), y = U(null), _ = U([]), C = U({}), $ = k(() => {
      switch (y.value) {
        case "compact":
          return "py-2";
        case "standard":
          return "py-3";
        default:
          return "py-4";
      }
    }), O = k(() => {
      if (!R.value || !oe(n.columns))
        return {};
      const T = rn(n.columns).reduce((X, ge) => {
        const ot = Q(n.columns, ge) || {};
        if (Q(ot, "hidden") === !0)
          return X;
        const Zn = Q(C.value, ge) === !1;
        return X[ge] = {
          label: ge,
          first: !1,
          last: !1,
          sortable: !0,
          visible: !Zn,
          ...ot
        }, X;
      }, {}), A = rn(T);
      return A.length > 0 && (T[A[0]].first = !0, T[A[A.length - 1]].last = !0), T;
    }), N = k(() => rn(O.value).reduce((T, A) => {
      const X = O.value[A];
      return X.visible && (T[A] = X), T;
    }, {})), j = k(() => L(n.data) ? n.data.reduce((T, A) => {
      if (!oe(A))
        return T;
      const X = rn(A).reduce((ge, ot) => (ge[ot] = {
        configuration: {
          searchable: Yu(A, ot),
          sortable: qu(A, ot)
        },
        content: A[ot]
      }, ge), {});
      return T.push({
        configuration: {
          id: ln()
        },
        content: X,
        raw: A
      }), T;
    }, []) : []), R = k(() => L(j.value)), Z = k(() => {
      if (!R.value)
        return [];
      if (!i.value)
        return j.value;
      const T = s.value.toLowerCase();
      return j.value.reduce((A, X) => {
        const ge = Q(X, "content");
        return oe(ge) && Object.entries(ge).some(([Un, Zn]) => {
          if (!(Q(n.columns, `${Un}.searchable`) !== !1))
            return !1;
          const Y = Q(Zn, "configuration.searchable");
          return F(Y) && Y.includes(T);
        }) && A.push(X), A;
      }, []);
    }), D = k(() => R.value ? l.value === null ? Z.value : fc(Z.value, `content.${l.value}.configuration.sortable`, { ascending: u.value === 1 }) : []), z = U([]), re = k(() => L(Z.value)), Se = k(() => wt(Z.value)), le = U([]), G = k(() => {
      if (n.enableSelection !== !0)
        return [];
      const T = j.value.filter((A) => le.value.includes(Io(A)));
      return L(T) ? T.map((A) => Oo(A)) : [];
    }), J = U(!1), $e = k(() => wt(le.value)), Ts = k(() => $e.value === Se.value);
    _e([Z, l, u], () => {
      c.value = 1;
    }), _e([D, c, u, l], ([T, A]) => {
      if (!n.enablePagination)
        z.value = T;
      else {
        const X = (A - 1) * 10, ge = X + 10;
        z.value = T.slice(X, ge);
      }
    }, { deep: !0, immediate: !0 }), _e(G, () => {
      if (n.enableSelection === !0) {
        if (!L(G.value)) {
          r.value = [], J.value === !0 && (J.value = !1);
          return;
        }
        r.value = G.value;
      }
    }), _e(le, () => {
      Ts.value && !J.value ? J.value = !0 : !Ts.value && J.value && (J.value = !1);
    });
    function Io(T) {
      return Q(T, "configuration.id");
    }
    function Ns(T, A) {
      const X = Q(T, `content.${A}.content`);
      return !F(X) && !pe(X) ? "" : X;
    }
    function Yu(T, A) {
      let X = T[A];
      if (F(X) || (X = ""), ct(n.searchableContentCallback)) {
        const ge = n.searchableContentCallback(A, T);
        F(ge) && (X = ge);
      }
      return F(X) && (X = X.toLowerCase()), X;
    }
    function qu(T, A) {
      let X = T[A];
      if (ct(n.sortableContentCallback)) {
        const ge = n.sortableContentCallback(A, T);
        F(ge) && (X = ge);
      }
      return F(X) && (X = X.toLowerCase()), X;
    }
    function Oo(T) {
      return Q(T, "raw");
    }
    function js(T) {
      return Q(O.value, `${T}.label`);
    }
    function zu(T) {
      F(T) && (s.value = T, ae(a.value, "triggerFocus"));
    }
    function Wu(T) {
      if (F(T) && Object.hasOwn(O.value, T)) {
        if (l.value === T) {
          u.value = u.value * -1;
          return;
        }
        l.value = T, u.value = 1;
      }
    }
    function Hu(T) {
      return T !== l.value ? null : u.value === 1 ? "ascending" : "descending";
    }
    function Gu(T) {
      return l.value !== T ? null : u.value == -1 ? "icon-arrow-up" : "icon-arrow-down";
    }
    function Ju(T) {
      L(T) && (_.value = T);
    }
    function Qu() {
      J.value ? le.value = Z.value.map((T) => Io(T)) : le.value = [];
    }
    return Qr("data-table", {
      columnDefinitions: O,
      haveTableName: f,
      searchPlaceholder: U(n.searchPlaceholder),
      tableName: U(n.name),
      updateTableDensityOptions: Ju
    }), t({
      setSearchQuery: zu
    }), (T, A) => {
      const X = M("alert-message"), ge = M("dropdown-menu-title"), ot = M("dropdown-menu"), Un = M("form-checkbox"), Zn = M("conditional-wrapper"), Rs = M("app-pagination");
      return m(), S("div", Ld, [
        v.value || w.value ? (m(), S("div", Ud, [
          v.value ? (m(), x(he(e.headingLevel), {
            key: 0,
            class: "text-3xl font-bold text-grey-950"
          }, {
            default: g(() => [
              b(T.$slots, "table-title")
            ]),
            _: 3
          })) : E("", !0),
          b(T.$slots, "table-introduction")
        ])) : E("", !0),
        p("div", Zd, [
          R.value ? E("", !0) : (m(), x(X, {
            key: 0,
            "data-test": "data-table-no-data"
          }, {
            default: g(() => [
              b(T.$slots, "no-data-message", {}, () => [
                A[6] || (A[6] = V(" No data to display. "))
              ])
            ]),
            _: 3
          })),
          R.value ? (m(), S("div", Yd, [
            e.enableSearch || d.value ? (m(), S("div", qd, [
              e.enableSearch ? (m(), x(Bd, {
                key: 0,
                ref_key: "dataTableSearchComponent",
                ref: a,
                modelValue: s.value,
                "onUpdate:modelValue": A[0] || (A[0] = (Y) => s.value = Y),
                class: "w-full"
              }, {
                "search-label": g(() => [
                  b(T.$slots, "search-label")
                ]),
                "reset-search-label": g(() => [
                  b(T.$slots, "reset-search-label")
                ]),
                _: 3
              }, 8, ["modelValue"])) : E("", !0),
              d.value ? (m(), x(ot, I({ key: 1 }, { align: "end" }, {
                class: "ms-auto",
                "data-test": "data-table-display-options"
              }), {
                summary: g(() => [
                  b(T.$slots, "configure-label", {}, () => [
                    A[7] || (A[7] = V(" Configure "))
                  ])
                ]),
                default: g(() => [
                  f.value ? (m(), S(de, { key: 0 }, [
                    P(ge, null, {
                      default: g(() => [
                        b(T.$slots, "display-options-label", {}, () => [
                          A[8] || (A[8] = V(" Display options "))
                        ])
                      ]),
                      _: 3
                    }),
                    P(Ad, {
                      modelValue: y.value,
                      "onUpdate:modelValue": A[1] || (A[1] = (Y) => y.value = Y)
                    }, ac({ _: 2 }, [
                      we(_.value, (Y) => ({
                        name: `display-option-${Y}-label`,
                        fn: g(() => [
                          b(T.$slots, `display-option-${Y}-label`)
                        ])
                      }))
                    ]), 1032, ["modelValue"]),
                    P(ge, null, {
                      default: g(() => [
                        b(T.$slots, "column-visibility-label", {}, () => [
                          A[9] || (A[9] = V(" Columns "))
                        ])
                      ]),
                      _: 3
                    }),
                    P(Fd, {
                      modelValue: C.value,
                      "onUpdate:modelValue": A[2] || (A[2] = (Y) => C.value = Y)
                    }, null, 8, ["modelValue"])
                  ], 64)) : E("", !0)
                ]),
                _: 3
              }, 16)) : E("", !0)
            ])) : E("", !0),
            me(p("table", zd, [
              h.value || e.enableSort && l.value ? (m(), S("caption", {
                key: 0,
                class: te(["text-left italic", { "mb-2": h.value }])
              }, [
                b(T.$slots, "caption"),
                p("span", Wd, [
                  b(T.$slots, "sorted-hint", H(ee({ sortedColumn: js(l.value), ascending: u.value === 1 })), () => [
                    V(" Sorted by " + ne(js(l.value)) + " ", 1),
                    u.value === 1 ? (m(), S(de, { key: 0 }, [
                      V(" ascending ")
                    ], 64)) : (m(), S(de, { key: 1 }, [
                      V(" descending ")
                    ], 64))
                  ])
                ])
              ], 2)) : E("", !0),
              p("thead", null, [
                p("tr", Hd, [
                  e.enableSelection ? (m(), S("th", Gd, [
                    P(Un, I({ displayLabel: !1 }, {
                      modelValue: J.value,
                      "onUpdate:modelValue": A[3] || (A[3] = (Y) => J.value = Y),
                      class: "shrink",
                      "data-test": "data-table-select-all-rows",
                      onChange: Qu
                    }), {
                      default: g(() => [
                        b(T.$slots, "select-all-rows-label", {}, () => [
                          A[10] || (A[10] = V(" Select all rows "))
                        ])
                      ]),
                      _: 3
                    }, 16, ["modelValue"])
                  ])) : E("", !0),
                  (m(!0), S(de, null, we(N.value, (Y, be) => (m(), S("th", I({ key: be }, { ref_for: !0 }, { "aria-sort": Hu(be) }, {
                    class: ["py-4", [{ "ps-3": !Y.sortable && !Y.first, "pe-3": !Y.sortable && !Y.last, "text-end": Y.align === "right", [e.headingClasses]: !Y.sortable, [Y.columnClasses]: !Y.sortable, [Y.headingClasses]: !Y.sortable }]],
                    "data-test": "data-table-heading"
                  }), [
                    P(Zn, I({ ref_for: !0 }, { wrap: Y.sortable, tag: "ui-button", iconEnd: Gu(be) }, {
                      class: ["-mt-4 mb-[calc(-1rem-1px)] w-full border-b border-transparent py-4 hocus:border-purple-800 hocus:bg-grey-100", [{ "ps-3": !Y.first, "pe-3": !Y.last, "justify-end": Y.align === "right" }, e.headingClasses, Y.columnClasses, Y.headingClasses]],
                      "data-test": "data-table-sort",
                      onClick: (tn) => Wu(be)
                    }), {
                      default: g(() => [
                        b(T.$slots, `${be}_heading`, I({ ref_for: !0 }, { key: be, label: be }), () => [
                          V(ne(Y.label), 1)
                        ])
                      ]),
                      _: 2
                    }, 1040, ["class", "onClick"])
                  ], 16))), 128))
                ])
              ]),
              p("tbody", null, [
                (m(!0), S(de, null, we(z.value, (Y) => (m(), S("tr", {
                  key: Y.configuration.id,
                  class: "border-b border-grey-200 transition-colors hover:bg-grey-50",
                  "data-test": "data-table-row"
                }, [
                  e.enableSelection ? (m(), S("td", Jd, [
                    P(Un, I({ ref_for: !0 }, { displayLabel: !1, inputAttributes: { value: Io(Y) } }, {
                      modelValue: le.value,
                      "onUpdate:modelValue": A[4] || (A[4] = (be) => le.value = be),
                      class: "shrink",
                      "data-test": "data-table-select-row"
                    }), {
                      default: g(() => [
                        b(T.$slots, "select-row-label", I({ ref_for: !0 }, { row: Oo(Y) }), () => [
                          A[11] || (A[11] = V(" Select row "))
                        ])
                      ]),
                      _: 2
                    }, 1040, ["modelValue"])
                  ])) : E("", !0),
                  (m(!0), S(de, null, we(N.value, (be, tn) => (m(), S("td", {
                    key: tn,
                    class: te([$.value, { "ps-3": !be.first, "pe-3": !be.last, "font-semibold text-grey-950": be.primary, "text-end": be.align === "right" }, e.cellClasses, be.columnClasses, be.cellClasses]),
                    "data-test": "data-table-cell"
                  }, [
                    b(T.$slots, tn, I({ ref_for: !0 }, { cell: Ns(Y, tn), row: Oo(Y) }), () => [
                      V(ne(Ns(Y, tn)), 1)
                    ])
                  ], 2))), 128))
                ]))), 128))
              ])
            ], 512), [
              [Ie, re.value]
            ]),
            e.enableSelection ? (m(), S("div", Qd, [
              b(T.$slots, "selected-row-count-label", H(ee({ selectedCount: $e.value })), () => [
                V(ne($e.value) + " rows selected ", 1)
              ])
            ])) : E("", !0),
            e.enablePagination ? me((m(), x(Rs, I({
              key: 2,
              modelValue: c.value,
              "onUpdate:modelValue": A[5] || (A[5] = (Y) => c.value = Y)
            }, { count: Se.value }, { "data-test": "data-table-pagination" }), {
              "page-number-page": g(({ page: Y }) => [
                b(T.$slots, "page-number-label", H(ee({ page: Y })))
              ]),
              "next-page-label": g(() => [
                b(T.$slots, "next-page-label")
              ]),
              "page-number-label": g(() => [
                b(T.$slots, "page-number-label")
              ]),
              "showing-items-label": g(({ first: Y, last: be, total: tn }) => [
                b(T.$slots, "showing-items-label", H(ee({ first: Y, last: be, total: tn })))
              ]),
              _: 3
            }, 16, ["modelValue"])), [
              [Ie, re.value]
            ]) : E("", !0),
            me(P(X, { "data-test": "data-table-no-results" }, {
              default: g(() => [
                b(T.$slots, "no-results-message", H(ee({ searchQuery: s.value })), () => [
                  A[12] || (A[12] = V(" No results could be found for term ")),
                  p("span", Xd, '"' + ne(s.value) + '"', 1),
                  A[13] || (A[13] = V(". "))
                ])
              ]),
              _: 3
            }, 512), [
              [Ie, !re.value]
            ])
          ])) : E("", !0)
        ])
      ]);
    };
  }
};
function Be(e, t, n, r, o) {
  return Ct(t, ((a, s) => {
    const i = a[s];
    if (i === void 0)
      throw new TypeError(Ja(s));
    return i;
  })(e, t), n, r, o);
}
function Ct(e, t, n, r, o, a) {
  const s = er(t, n, r);
  if (o && t !== s)
    throw new RangeError(nu(e, t, n, r, a));
  return s;
}
function Ve(e) {
  return e !== null && /object|function/.test(typeof e);
}
function ze(e, t = Map) {
  const n = new t();
  return (r, ...o) => {
    if (n.has(r))
      return n.get(r);
    const a = e(r, ...o);
    return n.set(r, a), a;
  };
}
function Kn(e) {
  return kn({
    name: e
  }, 1);
}
function kn(e, t) {
  return xt((n) => ({
    value: n,
    configurable: 1,
    writable: !t
  }), e);
}
function ef(e) {
  return xt((t) => ({
    get: t,
    configurable: 1
  }), e);
}
function ra(e) {
  return {
    [Symbol.toStringTag]: {
      value: e,
      configurable: 1
    }
  };
}
function Sn(e, t) {
  const n = {};
  let r = e.length;
  for (const o of t)
    n[e[--r]] = o;
  return n;
}
function xt(e, t, n) {
  const r = {};
  for (const o in t)
    r[o] = e(t[o], o, n);
  return r;
}
function Xr(e, t, n) {
  const r = {};
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    r[a] = e(a, o, n);
  }
  return r;
}
function Zi(e, t, n) {
  const r = {};
  for (let o = 0; o < e.length; o++)
    r[t[o]] = n[e[o]];
  return r;
}
function et(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const r of e)
    n[r] = t[r];
  return n;
}
function Us(e, t) {
  for (const n of t)
    if (n in e)
      return 1;
  return 0;
}
function Yi(e, t, n) {
  for (const r of e)
    if (t[r] !== n[r])
      return 0;
  return 1;
}
function qi(e, t, n) {
  const r = {
    ...n
  };
  for (let o = 0; o < t; o++)
    r[e[o]] = 0;
  return r;
}
function se(e, ...t) {
  return (...n) => e(...t, ...n);
}
function Zs(e) {
  return e[0].toUpperCase() + e.substring(1);
}
function ur(e) {
  return e.slice().sort();
}
function Br(e, t) {
  return String(t).padStart(e, "0");
}
function Vt(e, t) {
  return Math.sign(e - t);
}
function er(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function yt(e, t) {
  return [Math.floor(e / t), Jn(e, t)];
}
function Jn(e, t) {
  return (e % t + t) % t;
}
function Bt(e, t) {
  return [Kr(e, t), oa(e, t)];
}
function Kr(e, t) {
  return Math.trunc(e / t) || 0;
}
function oa(e, t) {
  return e % t || 0;
}
function Dr(e) {
  return Math.abs(e % 1) === 0.5;
}
function zi(e, t, n) {
  let r = 0, o = 0;
  for (let i = 0; i <= t; i++) {
    const l = e[n[i]], u = pt[i], c = ve / u, [f, d] = Bt(l, c);
    r += d * u, o += f;
  }
  const [a, s] = Bt(r, ve);
  return [o + a, s];
}
function eo(e, t, n) {
  const r = {};
  for (let o = t; o >= 0; o--) {
    const a = pt[o];
    r[n[o]] = Kr(e, a), e = oa(e, a);
  }
  return r;
}
function tf(e) {
  if (e !== void 0)
    return Te(e);
}
function nf(e) {
  if (e !== void 0)
    return gt(e);
}
function Wi(e) {
  if (e !== void 0)
    return aa(e);
}
function gt(e) {
  return Ji(aa(e));
}
function aa(e) {
  return Gi(p1(e));
}
function Hi(e, t) {
  if (t == null)
    throw new RangeError(Ja(e));
  return t;
}
function cr(e) {
  if (!Ve(e))
    throw new TypeError(Ap);
  return e;
}
function sa(e, t, n = e) {
  if (typeof t !== e)
    throw new TypeError(Jt(n, t));
  return t;
}
function Gi(e, t = "number") {
  if (!Number.isInteger(e))
    throw new RangeError(Tp(t, e));
  return e || 0;
}
function Ji(e, t = "number") {
  if (e <= 0)
    throw new RangeError(Np(t, e));
  return e;
}
function ia(e) {
  if (typeof e == "symbol")
    throw new TypeError(Vp);
  return String(e);
}
function Fr(e, t) {
  return Ve(e) ? String(e) : Te(e, t);
}
function la(e) {
  if (typeof e == "string")
    return BigInt(e);
  if (typeof e != "bigint")
    throw new TypeError(Fp(e));
  return e;
}
function Qi(e, t = "number") {
  if (typeof e == "bigint")
    throw new TypeError(Rp(t));
  if (e = Number(e), !Number.isFinite(e))
    throw new RangeError(jp(t, e));
  return e;
}
function je(e, t) {
  return Math.trunc(Qi(e, t)) || 0;
}
function ua(e, t) {
  return Gi(Qi(e, t), t);
}
function Ys(e, t) {
  return Ji(je(e, t), t);
}
function ca(e, t) {
  let [n, r] = Bt(t, ve), o = e + n;
  const a = Math.sign(o);
  return a && a === -Math.sign(r) && (o -= a, r += a * ve), [o, r];
}
function $n(e, t, n = 1) {
  return ca(e[0] + t[0] * n, e[1] + t[1] * n);
}
function on(e, t) {
  return ca(e[0], e[1] + t);
}
function dt(e, t) {
  return $n(t, e, -1);
}
function We(e, t) {
  return Vt(e[0], t[0]) || Vt(e[1], t[1]);
}
function Xi(e, t, n) {
  return We(e, t) === -1 || We(e, n) === 1;
}
function da(e, t = 1) {
  const n = BigInt(ve / t);
  return [Number(e / n), Number(e % n) * t];
}
function Lr(e, t = 1) {
  const n = ve / t, [r, o] = Bt(e, n);
  return [r, o * t];
}
function ft(e, t = 1, n) {
  const [r, o] = e, [a, s] = Bt(o, t);
  return r * (ve / t) + (a + (n ? s / t : 0));
}
function fa(e, t, n = yt) {
  const [r, o] = e, [a, s] = n(o, t);
  return [r * (ve / t) + a, s];
}
function pa(e) {
  return Be(e, "isoYear", sr, ar, 1), e.isoYear === sr ? Be(e, "isoMonth", 4, 12, 1) : e.isoYear === ar && Be(e, "isoMonth", 1, 9, 1), e;
}
function Qe(e) {
  return Ze({
    ...e,
    ...Ye,
    isoHour: 12
  }), e;
}
function Ze(e) {
  const t = Be(e, "isoYear", sr, ar, 1), n = t === sr ? 1 : t === ar ? -1 : 0;
  return n && mt(Oe({
    ...e,
    isoDay: e.isoDay + n,
    isoNanosecond: e.isoNanosecond - n
  })), e;
}
function mt(e) {
  if (!e || Xi(e, _1, b1))
    throw new RangeError(Qt);
  return e;
}
function Lt(e) {
  return zi(e, 5, rt)[1];
}
function to(e) {
  const [t, n] = yt(e, ve);
  return [eo(n, 5, rt), t];
}
function qs(e) {
  return fa(e, ut);
}
function Fe(e) {
  return In(e.isoYear, e.isoMonth, e.isoDay, e.isoHour, e.isoMinute, e.isoSecond, e.isoMillisecond);
}
function Oe(e) {
  const t = Fe(e);
  if (t !== void 0) {
    const [n, r] = Bt(t, Ue);
    return [n, r * It + (e.isoMicrosecond || 0) * gr + (e.isoNanosecond || 0)];
  }
}
function ma(e, t) {
  const [n, r] = to(Lt(e) - t);
  return mt(Oe({
    ...e,
    isoDay: e.isoDay + r,
    ...n
  }));
}
function Ur(...e) {
  return In(...e) / du;
}
function In(...e) {
  const [t, n] = Ki(...e), r = t.valueOf();
  if (!isNaN(r))
    return r - n * Ue;
}
function Ki(e, t = 1, n = 1, r = 0, o = 0, a = 0, s = 0) {
  const i = e === sr ? 1 : e === ar ? -1 : 0, l = /* @__PURE__ */ new Date();
  return l.setUTCHours(r, o, a, s), l.setUTCFullYear(e, t - 1, n + i), [l, i];
}
function On(e, t) {
  let [n, r] = on(e, t);
  r < 0 && (r += ve, n -= 1);
  const [o, a] = yt(r, It), [s, i] = yt(a, gr);
  return no(n * Ue + o, s, i);
}
function no(e, t = 0, n = 0) {
  const r = Math.ceil(Math.max(0, Math.abs(e) - ls) / Ue) * Math.sign(e), o = new Date(e - r * Ue);
  return Sn(Co, [o.getUTCFullYear(), o.getUTCMonth() + 1, o.getUTCDate() + r, o.getUTCHours(), o.getUTCMinutes(), o.getUTCSeconds(), o.getUTCMilliseconds(), t, n]);
}
function ha(e, t) {
  if (t < -ls)
    throw new RangeError(Qt);
  const n = e.formatToParts(t), r = {};
  for (const o of n)
    r[o.type] = o.value;
  return r;
}
function va(e) {
  return [e.isoYear, e.isoMonth, e.isoDay];
}
function el(e, t) {
  return [t, 0];
}
function tl() {
  return Tt;
}
function nl(e, t) {
  switch (t) {
    case 2:
      return ga(e) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
  }
  return 31;
}
function rl(e) {
  return ga(e) ? 366 : 365;
}
function ga(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function ol(e) {
  const [t, n] = Ki(e.isoYear, e.isoMonth, e.isoDay);
  return Jn(t.getUTCDay() - n, 7) || 7;
}
function al(e) {
  return this.id === Vn ? (({ isoYear: t }) => t < 1 ? ["gregory-inverse", 1 - t] : ["gregory", t])(e) : this.id === Yt ? $1(e) : [];
}
function rf(e) {
  const t = Fe(e);
  if (t < k1) {
    const { isoYear: a } = e;
    return a < 1 ? ["japanese-inverse", 1 - a] : ["japanese", a];
  }
  const n = ha(ys(Yt), t), { era: r, eraYear: o } = ql(n, Yt);
  return [r, o];
}
function ro(e) {
  return un(e), En(e, 1), e;
}
function un(e) {
  return sl(e, 1), e;
}
function zs(e) {
  return Yi(as, e, sl(e));
}
function sl(e, t) {
  const { isoYear: n } = e, r = Be(e, "isoMonth", 1, tl(), t);
  return {
    isoYear: n,
    isoMonth: r,
    isoDay: Be(e, "isoDay", 1, nl(n, r), t)
  };
}
function En(e, t) {
  return Sn(rt, [Be(e, "isoHour", 0, 23, t), Be(e, "isoMinute", 0, 59, t), Be(e, "isoSecond", 0, 59, t), Be(e, "isoMillisecond", 0, 999, t), Be(e, "isoMicrosecond", 0, 999, t), Be(e, "isoNanosecond", 0, 999, t)]);
}
function ce(e) {
  return e === void 0 ? 0 : Mu(cr(e));
}
function oo(e, t = 0) {
  e = ht(e);
  const n = Su(e), r = N1(e, t);
  return [Mu(e), r, n];
}
function Dn(e, t, n, r = 9, o = 0, a = 4) {
  t = ht(t);
  let s = xu(t, r, o), i = _a(t), l = _r(t, a);
  const u = br(t, r, o, 1);
  return s == null ? s = Math.max(n, u) : cl(s, u), i = wa(i, u, 1), e && (l = ((c) => c < 4 ? (c + 2) % 4 : c)(l)), [s, u, i, l];
}
function ao(e, t = 6, n) {
  let r = _a(e = so(e, Hr));
  const o = _r(e, 7);
  let a = br(e, t);
  return a = Hi(Hr, a), r = wa(r, a, void 0, n), [a, r, o];
}
function ya(e) {
  return us(ht(e));
}
function il(e, t) {
  return ba(ht(e), t);
}
function of(e) {
  const t = so(e, Po), n = qt(Po, D1, t, 0);
  if (!n)
    throw new RangeError(Jt(Po, n));
  return n;
}
function ba(e, t = 4) {
  const n = ul(e);
  return [_r(e, 4), ...ll(br(e, t), n)];
}
function ll(e, t) {
  return e != null ? [pt[e], e < 4 ? 9 - 3 * e : -1] : [t === void 0 ? 1 : 10 ** (9 - t), t];
}
function _a(e) {
  const t = e[Qn];
  return t === void 0 ? 1 : je(t, Qn);
}
function wa(e, t, n, r) {
  const o = r ? ve : pt[t + 1];
  if (o) {
    const a = pt[t];
    if (o % ((e = Ct(Qn, e, 1, o / a - (r ? 0 : 1), 1)) * a))
      throw new RangeError(Jt(Qn, e));
  } else
    e = Ct(Qn, e, 1, n ? 10 ** 9 : 1, 1);
  return e;
}
function ul(e) {
  let t = e[Ao];
  if (t !== void 0) {
    if (typeof t != "number") {
      if (ia(t) === "auto")
        return;
      throw new RangeError(Jt(Ao, t));
    }
    t = Ct(Ao, Math.floor(t), 0, 9, 1);
  }
  return t;
}
function ht(e) {
  return e === void 0 ? {} : cr(e);
}
function so(e, t) {
  return typeof e == "string" ? {
    [t]: e
  } : cr(e);
}
function io(e) {
  return {
    overflow: C1[e]
  };
}
function ka(e, t, n = 9, r = 0, o) {
  let a = t[e];
  if (a === void 0)
    return o ? r : void 0;
  if (a = ia(a), a === "auto")
    return o ? r : null;
  let s = zo[a];
  if (s === void 0 && (s = v1[a]), s === void 0)
    throw new RangeError(ou(e, a, zo));
  return Ct(e, s, r, n, 1, Qa), s;
}
function qt(e, t, n, r = 0) {
  const o = n[e];
  if (o === void 0)
    return r;
  const a = ia(o), s = t[a];
  if (s === void 0)
    throw new RangeError(ou(e, a, t));
  return s;
}
function cl(e, t) {
  if (t > e)
    throw new RangeError(a1);
}
function Mt(e) {
  return {
    branding: ps,
    epochNanoseconds: e
  };
}
function tt(e, t, n) {
  return {
    branding: Xt,
    calendar: n,
    timeZone: t,
    epochNanoseconds: e
  };
}
function nt(e, t = e.calendar) {
  return {
    branding: An,
    calendar: t,
    ...et(g1, e)
  };
}
function St(e, t = e.calendar) {
  return {
    branding: wr,
    calendar: t,
    ...et(ss, e)
  };
}
function tr(e, t = e.calendar) {
  return {
    branding: cs,
    calendar: t,
    ...et(ss, e)
  };
}
function Zr(e, t = e.calendar) {
  return {
    branding: ds,
    calendar: t,
    ...et(ss, e)
  };
}
function vt(e) {
  return {
    branding: fs,
    ...et(wu, e)
  };
}
function xe(e) {
  return {
    branding: ms,
    sign: zt(e),
    ...et(ns, e)
  };
}
function $a(e) {
  return fa(e.epochNanoseconds, It)[0];
}
function af(e) {
  return ((t, n = 1) => {
    const [r, o] = t, a = Math.floor(o / n), s = ve / n;
    return BigInt(r) * BigInt(s) + BigInt(a);
  })(e.epochNanoseconds);
}
function dl(e) {
  return e.epochNanoseconds;
}
function sf(e, t, n, r, o) {
  const a = an(r), [s, i] = ((_, C) => {
    const $ = C((_ = so(_, Go))[$u]);
    let O = T1(_);
    return O = Hi(Go, O), [O, $];
  })(o, e), l = Math.max(s, a);
  if (!i && rr(l, i))
    return Ws(r, s);
  if (!i)
    throw new RangeError(wo);
  if (!r.sign)
    return 0;
  const [u, c, f] = po(t, n, i), d = Ta(f), h = mo(f), v = Na(f), w = h(c, u, r);
  Cn(i) || (Ze(u), Ze(w));
  const y = v(c, u, w, s);
  return rr(s, i) ? Ws(y, s) : ((_, C, $, O, N, j, R) => {
    const Z = zt(_), [D, z] = Ca(O, os($, _), $, Z, N, j, R), re = xa(C, D, z);
    return _[fe[$]] + re * Z;
  })(y, d(w), s, c, u, d, h);
}
function Ws(e, t) {
  return ft(Ee(e), pt[t], 1);
}
function Ca(e, t, n, r, o, a, s) {
  const i = fe[n], l = {
    ...t,
    [i]: t[i] + r
  }, u = s(e, o, t), c = s(e, o, l);
  return [a(u), a(c)];
}
function xa(e, t, n) {
  const r = ft(dt(t, n));
  if (!r)
    throw new RangeError(Fn);
  return ft(dt(t, e)) / r;
}
function lf(e, t) {
  const [n, r, o] = ao(t, 5, 1);
  return Mt(uo(e.epochNanoseconds, n, r, o, 1));
}
function uf(e, t, n) {
  let { epochNanoseconds: r, timeZone: o, calendar: a } = t;
  const [s, i, l] = ao(n);
  if (s === 0 && i === 1)
    return t;
  const u = e(o);
  if (s === 6)
    r = ((c, f, d, h) => {
      const v = Ge(d, f), [w, y] = c(v), _ = d.epochNanoseconds, C = Zt(f, w), $ = Zt(f, y);
      if (Xi(_, C, $))
        throw new RangeError(Fn);
      return vl(xa(_, C, $), h) ? $ : C;
    })(ml, u, t, l);
  else {
    const c = u.R(r);
    r = Tn(u, fl(On(r, c), s, i, l), c, 2, 0, 1);
  }
  return tt(r, o, a);
}
function cf(e, t) {
  return nt(fl(e, ...ao(t)), e.calendar);
}
function df(e, t) {
  const [n, r, o] = ao(t, 5);
  var a;
  return vt((a = o, Ma(e, dr(n, r), a)[0]));
}
function ff(e, t) {
  const n = e(t.timeZone), r = Ge(t, n), [o, a] = ml(r), s = ft(dt(Zt(n, o), Zt(n, a)), $o, 1);
  if (s <= 0)
    throw new RangeError(Fn);
  return s;
}
function pf(e, t) {
  const { timeZone: n, calendar: r } = t, o = ((a, s, i) => Zt(s, a(Ge(i, s))))(hl, e(n), t);
  return tt(o, n, r);
}
function fl(e, t, n, r) {
  return pl(e, dr(t, n), r);
}
function pl(e, t, n) {
  const [r, o] = Ma(e, t, n);
  return Ze({
    ...cn(e, o),
    ...r
  });
}
function Ma(e, t, n) {
  return to(Ut(Lt(e), t, n));
}
function Yr(e) {
  return Ut(e, ko, 7);
}
function dr(e, t) {
  return pt[e] * t;
}
function ml(e) {
  const t = hl(e);
  return [t, cn(t, 1)];
}
function hl(e) {
  return y1(6, e);
}
function mf(e, t, n) {
  const r = Math.min(an(e), 6);
  return Nn(co(Ee(e, r), t, n), r);
}
function lo(e, t, n, r, o, a, s, i, l, u) {
  if (r === 0 && o === 1)
    return e;
  const c = rr(r, i) ? Cn(i) && r < 6 && n >= 6 ? vf : hf : gf;
  let [f, d, h] = c(e, t, n, r, o, a, s, i, l, u);
  return h && r !== 7 && (f = ((v, w, y, _, C, $, O, N) => {
    const j = zt(v);
    for (let R = _ + 1; R <= y; R++) {
      if (R === 7 && y !== 7)
        continue;
      const Z = os(R, v);
      Z[fe[R]] += j;
      const D = ft(dt(O(N(C, $, Z)), w));
      if (D && Math.sign(D) !== j)
        break;
      v = Z;
    }
    return v;
  })(f, d, n, Math.max(6, r), s, i, l, u)), f;
}
function uo(e, t, n, r, o) {
  if (t === 6) {
    const a = ((s) => s[0] + s[1] / ve)(e);
    return [Ut(a, n, r), 0];
  }
  return co(e, dr(t, n), r, o);
}
function co(e, t, n, r) {
  let [o, a] = e;
  r && a < 0 && (a += ve, o -= 1);
  const [s, i] = yt(Ut(a, t, n), ve);
  return ca(o + s, i);
}
function Ut(e, t, n) {
  return vl(e / t, n) * t;
}
function vl(e, t) {
  return F1[t](e);
}
function hf(e, t, n, r, o, a) {
  const s = zt(e), i = Ee(e), l = uo(i, r, o, a), u = dt(i, l), c = Math.sign(l[0] - i[0]) === s, f = Nn(l, Math.min(n, 6));
  return [{
    ...e,
    ...f
  }, $n(t, u), c];
}
function vf(e, t, n, r, o, a, s, i, l, u) {
  const c = zt(e) || 1, f = ft(Ee(e, 5)), d = dr(r, o);
  let h = Ut(f, d, a);
  const [v, w] = Ca(s, {
    ...e,
    ...rs
  }, 6, c, i, l, u), y = h - ft(dt(v, w));
  let _ = 0;
  y && Math.sign(y) !== c ? t = on(v, h) : (_ += c, h = Ut(y, d, a), t = on(w, h));
  const C = ho(h);
  return [{
    ...e,
    ...C,
    days: e.days + _
  }, t, !!_];
}
function gf(e, t, n, r, o, a, s, i, l, u) {
  const c = zt(e), f = fe[r], d = os(r, e);
  r === 7 && (e = {
    ...e,
    weeks: e.weeks + Math.trunc(e.days / 7)
  });
  const h = Kr(e[f], o) * o;
  d[f] = h;
  const [v, w] = Ca(s, d, r, o * c, i, l, u), y = h + xa(t, v, w) * c * o, _ = Ut(y, o, a), C = Math.sign(_ - y) === c;
  return d[f] = _, [d, C ? w : v, C];
}
function Hs(e, t, n, r) {
  const [o, a, s, i] = ((u) => {
    const c = ba(u = ht(u));
    return [u.timeZone, ...c];
  })(r), l = o !== void 0;
  return ((u, c, f, d, h, v) => {
    f = co(f, h, d, 1);
    const w = c.R(f);
    return Sa(On(f, w), v) + (u ? fr(Yr(w)) : "Z");
  })(l, t(l ? e(o) : mn), n.epochNanoseconds, a, s, i);
}
function Gs(e, t, n) {
  const [r, o, a, s, i, l] = ((u) => {
    u = ht(u);
    const c = us(u), f = ul(u), d = R1(u), h = _r(u, 4), v = br(u, 4);
    return [c, j1(u), d, h, ...ll(v, f)];
  })(n);
  return ((u, c, f, d, h, v, w, y, _, C) => {
    d = co(d, _, y, 1);
    const $ = u(f).R(d);
    return Sa(On(d, $), C) + fr(Yr($), w) + ((O, N) => N !== 1 ? "[" + (N === 2 ? "!" : "") + O + "]" : "")(f, v) + Ia(c, h);
  })(e, t.calendar, t.timeZone, t.epochNanoseconds, r, o, a, s, i, l);
}
function Js(e, t) {
  const [n, r, o, a] = ((u) => (u = ht(u), [us(u), ...ba(u)]))(t);
  return s = e.calendar, i = n, l = a, Sa(pl(e, o, r), l) + Ia(s, i);
  var s, i, l;
}
function Qs(e, t) {
  return n = e.calendar, r = e, o = ya(t), qr(r) + Ia(n, o);
  var n, r, o;
}
function Xs(e, t) {
  return gl(e.calendar, yl, e, ya(t));
}
function Ks(e, t) {
  return gl(e.calendar, yf, e, ya(t));
}
function ei(e, t) {
  const [n, r, o] = il(t);
  return a = o, bl(Ma(e, r, n)[0], a);
  var a;
}
function To(e, t) {
  const [n, r, o] = il(t, 3);
  return r > 1 && dn(e = {
    ...e,
    ...mf(e, r, n)
  }), ((a, s) => {
    const { sign: i } = a, l = i === -1 ? Ae(a) : a, { hours: u, minutes: c } = l, [f, d] = fa(Ee(l, 3), ut, Bt);
    $l(f);
    const h = Oa(d, s), v = s >= 0 || !i || h;
    return (i < 0 ? "-" : "") + "P" + ti({
      Y: nn(l.years),
      M: nn(l.months),
      W: nn(l.weeks),
      D: nn(l.days)
    }) + (u || c || f || v ? "T" + ti({
      H: nn(u),
      M: nn(c),
      S: nn(f, v) + h
    }) : "");
  })(e, o);
}
function gl(e, t, n, r) {
  const o = r > 1 || r === 0 && e !== ie;
  return r === 1 ? e === ie ? t(n) : qr(n) : o ? qr(n) + _l(e, r === 2) : t(n);
}
function ti(e) {
  const t = [];
  for (const n in e) {
    const r = e[n];
    r && t.push(r, n);
  }
  return t.join("");
}
function Sa(e, t) {
  return qr(e) + "T" + bl(e, t);
}
function qr(e) {
  return yl(e) + "-" + Xe(e.isoDay);
}
function yl(e) {
  const { isoYear: t } = e;
  return (t < 0 || t > 9999 ? wl(t) + Br(6, Math.abs(t)) : Br(4, t)) + "-" + Xe(e.isoMonth);
}
function yf(e) {
  return Xe(e.isoMonth) + "-" + Xe(e.isoDay);
}
function bl(e, t) {
  const n = [Xe(e.isoHour), Xe(e.isoMinute)];
  return t !== -1 && n.push(Xe(e.isoSecond) + ((r, o, a, s) => Oa(r * It + o * gr + a, s))(e.isoMillisecond, e.isoMicrosecond, e.isoNanosecond, t)), n.join(":");
}
function fr(e, t = 0) {
  if (t === 1)
    return "";
  const [n, r] = yt(Math.abs(e), $o), [o, a] = yt(r, ko), [s, i] = yt(a, ut);
  return wl(e) + Xe(n) + ":" + Xe(o) + (s || i ? ":" + Xe(s) + Oa(i) : "");
}
function Ia(e, t) {
  return t !== 1 && (t > 1 || t === 0 && e !== ie) ? _l(e, t === 2) : "";
}
function _l(e, t) {
  return "[" + (t ? "!" : "") + "u-ca=" + e + "]";
}
function Oa(e, t) {
  let n = Br(9, e);
  return n = t === void 0 ? n.replace(P1, "") : n.slice(0, t), n ? "." + n : "";
}
function wl(e) {
  return e < 0 ? "-" : "+";
}
function nn(e, t) {
  return e || t ? e.toLocaleString("fullwide", {
    useGrouping: 0
  }) : "";
}
function bf(e, t) {
  const { epochNanoseconds: n } = e, r = (t.R ? t : t(e.timeZone)).R(n), o = On(n, r);
  return {
    calendar: e.calendar,
    ...o,
    offsetNanoseconds: r
  };
}
function Tn(e, t, n, r = 0, o = 0, a, s) {
  if (n !== void 0 && r === 1 && (r === 1 || s))
    return ma(t, n);
  const i = e.I(t);
  if (n !== void 0 && r !== 3) {
    const l = ((u, c, f, d) => {
      const h = Oe(c);
      d && (f = Yr(f));
      for (const v of u) {
        let w = ft(dt(v, h));
        if (d && (w = Yr(w)), w === f)
          return v;
      }
    })(i, t, n, a);
    if (l !== void 0)
      return l;
    if (r === 0)
      throw new RangeError(Kp);
  }
  return s ? Oe(t) : pr(e, t, o, i);
}
function pr(e, t, n = 0, r = e.I(t)) {
  if (r.length === 1)
    return r[0];
  if (n === 1)
    throw new RangeError(e1);
  if (r.length)
    return r[n === 3 ? 1 : 0];
  const o = Oe(t), a = ((i, l) => {
    const u = i.R(on(l, -ve));
    return ((c) => {
      if (c > ve)
        throw new RangeError(Xp);
      return c;
    })(i.R(on(l, ve)) - u);
  })(e, o), s = a * (n === 2 ? -1 : 1);
  return (r = e.I(On(o, s)))[n === 2 ? 0 : r.length - 1];
}
function Zt(e, t) {
  const n = e.I(t);
  if (n.length)
    return n[0];
  const r = on(Oe(t), -ve);
  return e.O(r, 1);
}
function ni(e, t, n) {
  return Mt(mt($n(t.epochNanoseconds, ((r) => {
    if (Cl(r))
      throw new RangeError(r1);
    return Ee(r, 5);
  })(e ? Ae(n) : n))));
}
function ri(e, t, n, r, o, a = /* @__PURE__ */ Object.create(null)) {
  const s = t(r.timeZone), i = e(r.calendar);
  return {
    ...r,
    ...Ea(s, i, r, n ? Ae(o) : o, a)
  };
}
function oi(e, t, n, r, o = /* @__PURE__ */ Object.create(null)) {
  const { calendar: a } = n;
  return nt(Da(e(a), n, t ? Ae(r) : r, o), a);
}
function ai(e, t, n, r, o) {
  const { calendar: a } = n;
  return St(fo(e(a), n, t ? Ae(r) : r, o), a);
}
function si(e, t, n, r, o) {
  const a = n.calendar, s = e(a);
  let i = Qe(nr(s, n));
  t && (r = ja(r)), r.sign < 0 && (i = s.P(i, {
    ...De,
    months: 1
  }), i = cn(i, -1));
  const l = s.P(i, r, o);
  return tr(nr(s, l), a);
}
function ii(e, t, n) {
  return vt(kl(t, e ? Ae(n) : n)[0]);
}
function Ea(e, t, n, r, o) {
  const a = Ee(r, 5);
  let s = n.epochNanoseconds;
  if (Cl(r)) {
    const i = Ge(n, e);
    s = $n(pr(e, {
      ...fo(t, i, {
        ...r,
        ...rs
      }, o),
      ...et(rt, i)
    }), a);
  } else
    s = $n(s, a), ce(o);
  return {
    epochNanoseconds: mt(s)
  };
}
function Da(e, t, n, r) {
  const [o, a] = kl(t, n);
  return Ze({
    ...fo(e, t, {
      ...n,
      ...rs,
      days: n.days + a
    }, r),
    ...o
  });
}
function fo(e, t, n, r) {
  if (n.years || n.months || n.weeks)
    return e.P(t, n, r);
  ce(r);
  const o = n.days + Ee(n, 5)[0];
  return o ? Qe(cn(t, o)) : t;
}
function nr(e, t, n = 1) {
  return cn(t, n - e.day(t));
}
function kl(e, t) {
  const [n, r] = Ee(t, 5), [o, a] = to(Lt(e) + r);
  return [o, n + a];
}
function cn(e, t) {
  return t ? {
    ...e,
    ...no(Fe(e) + t * Ue)
  } : e;
}
function po(e, t, n) {
  const r = e(n.calendar);
  return Cn(n) ? [n, r, t(n.timeZone)] : [{
    ...n,
    ...Ye
  }, r];
}
function Ta(e) {
  return e ? dl : Oe;
}
function mo(e) {
  return e ? se(Ea, e) : Da;
}
function Na(e) {
  return e ? se(Zf, e) : Yf;
}
function Cn(e) {
  return e && e.epochNanoseconds;
}
function rr(e, t) {
  return e <= 6 - (Cn(t) ? 1 : 0);
}
function li(e, t, n, r, o, a, s) {
  const i = e(ht(s).relativeTo), l = Math.max(an(o), an(a));
  if (rr(l, i))
    return xe(dn(((w, y, _, C) => {
      const $ = $n(Ee(w), Ee(y), C ? -1 : 1);
      if (!Number.isFinite($[0]))
        throw new RangeError(Qt);
      return {
        ...De,
        ...Nn($, _)
      };
    })(o, a, l, r)));
  if (!i)
    throw new RangeError(wo);
  r && (a = Ae(a));
  const [u, c, f] = po(t, n, i), d = mo(f), h = Na(f), v = d(c, u, o);
  return xe(h(c, u, d(c, v, a), l));
}
function _f(e, t, n, r, o) {
  const a = an(r), [s, i, l, u, c] = ((j, R, Z) => {
    j = so(j, Hr);
    let D = xu(j);
    const z = Z(j[$u]);
    let re = _a(j);
    const Se = _r(j, 7);
    let le = br(j);
    if (D === void 0 && le === void 0)
      throw new RangeError(o1);
    if (le == null && (le = 0), D == null && (D = Math.max(le, R)), cl(D, le), re = wa(re, le, 1), re > 1 && le > 5 && D !== le)
      throw new RangeError("For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit");
    return [D, le, re, Se, z];
  })(o, a, e), f = Math.max(a, s);
  if (!c && f <= 6)
    return xe(dn(((j, R, Z, D, z) => {
      const re = uo(Ee(j), Z, D, z);
      return {
        ...De,
        ...Nn(re, R)
      };
    })(r, s, i, l, u)));
  if (!Cn(c) && !r.sign)
    return r;
  if (!c)
    throw new RangeError(wo);
  const [d, h, v] = po(t, n, c), w = Ta(v), y = mo(v), _ = Na(v), C = y(h, d, r);
  Cn(c) || (Ze(d), Ze(C));
  let $ = _(h, d, C, s);
  const O = r.sign, N = zt($);
  if (O && N && O !== N)
    throw new RangeError(Fn);
  return $ = lo($, w(C), s, i, l, u, h, d, w, y), xe($);
}
function wf(e) {
  return e.sign === -1 ? ja(e) : e;
}
function ja(e) {
  return xe(Ae(e));
}
function Ae(e) {
  const t = {};
  for (const n of fe)
    t[n] = -1 * e[n] || 0;
  return t;
}
function kf(e) {
  return !e.sign;
}
function zt(e, t = fe) {
  let n = 0;
  for (const r of t) {
    const o = Math.sign(e[r]);
    if (o) {
      if (n && n !== o)
        throw new RangeError(n1);
      n = o;
    }
  }
  return n;
}
function dn(e) {
  for (const t of h1)
    Ct(t, e[t], -bi, bi, 1);
  return $l(ft(Ee(e), ut)), e;
}
function $l(e) {
  if (!Number.isSafeInteger(e))
    throw new RangeError(t1);
}
function Ee(e, t = 6) {
  return zi(e, t, fe);
}
function Nn(e, t = 6) {
  const [n, r] = e, o = eo(r, t, fe);
  if (o[fe[t]] += n * (ve / pt[t]), !Number.isFinite(o[fe[t]]))
    throw new RangeError(Qt);
  return o;
}
function ho(e, t = 5) {
  return eo(e, t, fe);
}
function Cl(e) {
  return !!zt(e, _u);
}
function an(e) {
  let t = 9;
  for (; t > 0 && !e[fe[t]]; t--)
    ;
  return t;
}
function $f(e, t) {
  return [e, t];
}
function ui(e) {
  const t = Math.floor(e / Ar) * Ar;
  return [t, t + Ar];
}
function Cf(e) {
  const t = Wt(e = Fr(e));
  if (!t)
    throw new RangeError(Le(e));
  let n;
  if (t.j)
    n = 0;
  else {
    if (!t.offset)
      throw new RangeError(Le(e));
    n = fn(t.offset);
  }
  return t.timeZone && Pa(t.timeZone, 1), Mt(ma(ro(t), n));
}
function xf(e) {
  const t = Wt(Te(e));
  if (!t)
    throw new RangeError(Le(e));
  if (t.timeZone)
    return xl(t, t.offset ? fn(t.offset) : void 0);
  if (t.j)
    throw new RangeError(Le(e));
  return Sl(t);
}
function Mf(e, t) {
  const n = Wt(Te(e));
  if (!n || !n.timeZone)
    throw new RangeError(Le(e));
  const { offset: r } = n, o = r ? fn(r) : void 0, [, a, s] = oo(t);
  return xl(n, o, a, s);
}
function fn(e) {
  const t = Pa(e);
  if (t === void 0)
    throw new RangeError(Le(e));
  return t;
}
function Sf(e) {
  const t = Wt(Te(e));
  if (!t || t.j)
    throw new RangeError(Le(e));
  return nt(Ml(t));
}
function Ra(e, t, n) {
  let r = Wt(Te(e));
  if (!r || r.j)
    throw new RangeError(Le(e));
  return t ? r.calendar === ie && (r = r.isoYear === -271821 && r.isoMonth === 4 ? {
    ...r,
    isoDay: 20,
    ...Ye
  } : {
    ...r,
    isoDay: 1,
    ...Ye
  }) : n && r.calendar === ie && (r = {
    ...r,
    isoYear: _t
  }), St(r.C ? Ml(r) : Sl(r));
}
function If(e, t) {
  const n = Va(Te(t));
  if (n)
    return Fa(n), tr(pa(un(n)));
  const r = Ra(t, 1);
  return tr(nr(e(r.calendar), r));
}
function Fa(e) {
  if (e.calendar !== ie)
    throw new RangeError(bt(e.calendar));
}
function Of(e, t) {
  const n = Aa(Te(t));
  if (n)
    return Fa(n), Zr(un(n));
  const r = Ra(t, 0, 1), { calendar: o } = r, a = e(o), [s, i, l] = a.v(r), [u, c] = a.q(s, i), [f, d] = a.G(u, c, l);
  return Zr(Qe(a.V(f, d, l)), o);
}
function Ef(e) {
  let t, n = ((r) => {
    const o = z1.exec(r);
    return o ? (vo(o[10]), El(o)) : void 0;
  })(Te(e));
  if (!n) {
    if (n = Wt(e), !n)
      throw new RangeError(Le(e));
    if (!n.C)
      throw new RangeError(Le(e));
    if (n.j)
      throw new RangeError(bt("Z"));
    Fa(n);
  }
  if ((t = Va(e)) && zs(t))
    throw new RangeError(Le(e));
  if ((t = Aa(e)) && zs(t))
    throw new RangeError(Le(e));
  return vt(En(n, 1));
}
function Df(e) {
  const t = ((n) => {
    const r = G1.exec(n);
    return r ? ((o) => {
      function a(c, f, d) {
        let h = 0, v = 0;
        if (d && ([h, l] = yt(l, pt[d])), c !== void 0) {
          if (i)
            throw new RangeError(bt(c));
          v = ((w) => {
            const y = parseInt(w);
            if (!Number.isFinite(y))
              throw new RangeError(bt(w));
            return y;
          })(c), s = 1, f && (l = Ba(f) * (pt[d] / ut), i = 1);
        }
        return h + v;
      }
      let s = 0, i = 0, l = 0, u = {
        ...Sn(fe, [a(o[2]), a(o[3]), a(o[4]), a(o[5]), a(o[6], o[7], 5), a(o[8], o[9], 4), a(o[10], o[11], 3)]),
        ...eo(l, 2, fe)
      };
      if (!s)
        throw new RangeError(ru(fe));
      return La(o[1]) < 0 && (u = Ae(u)), u;
    })(r) : void 0;
  })(Te(e));
  if (!t)
    throw new RangeError(Le(e));
  return xe(dn(t));
}
function Tf(e) {
  const t = Wt(e) || Va(e) || Aa(e);
  return t ? t.calendar : e;
}
function Nf(e) {
  const t = Wt(e);
  return t && (t.timeZone || t.j && mn || t.offset) || e;
}
function xl(e, t, n = 0, r = 0) {
  const o = Ua(e.timeZone), a = K(o);
  let s;
  return ro(e), s = e.C ? Tn(a, e, t, n, r, !a.$, e.j) : Zt(a, e), tt(s, o, _o(e.calendar));
}
function Ml(e) {
  return Il(Ze(ro(e)));
}
function Sl(e) {
  return Il(Qe(un(e)));
}
function Il(e) {
  return {
    ...e,
    calendar: _o(e.calendar)
  };
}
function Wt(e) {
  const t = q1.exec(e);
  return t ? ((n) => {
    const r = n[10], o = (r || "").toUpperCase() === "Z";
    return {
      isoYear: Ol(n),
      isoMonth: parseInt(n[4]),
      isoDay: parseInt(n[5]),
      ...El(n.slice(5)),
      ...vo(n[16]),
      C: !!n[6],
      j: o,
      offset: o ? void 0 : r
    };
  })(t) : void 0;
}
function Va(e) {
  const t = Z1.exec(e);
  return t ? ((n) => ({
    isoYear: Ol(n),
    isoMonth: parseInt(n[4]),
    isoDay: 1,
    ...vo(n[5])
  }))(t) : void 0;
}
function Aa(e) {
  const t = Y1.exec(e);
  return t ? ((n) => ({
    isoYear: _t,
    isoMonth: parseInt(n[1]),
    isoDay: parseInt(n[2]),
    ...vo(n[3])
  }))(t) : void 0;
}
function Pa(e, t) {
  const n = W1.exec(e);
  return n ? ((r, o) => {
    const a = r[4] || r[5];
    if (o && a)
      throw new RangeError(bt(a));
    return ((s) => {
      if (Math.abs(s) >= ve)
        throw new RangeError(Qp);
      return s;
    })((wn(r[2]) * $o + wn(r[3]) * ko + wn(r[4]) * ut + Ba(r[5] || "")) * La(r[1]));
  })(n, t) : void 0;
}
function Ol(e) {
  const t = La(e[1]), n = parseInt(e[2] || e[3]);
  if (t < 0 && !n)
    throw new RangeError(bt(-0));
  return t * n;
}
function El(e) {
  const t = wn(e[3]);
  return {
    ...to(Ba(e[4] || ""))[0],
    isoHour: wn(e[1]),
    isoMinute: wn(e[2]),
    isoSecond: t === 60 ? 59 : t
  };
}
function vo(e) {
  let t, n;
  const r = [];
  if (e.replace(H1, (o, a, s) => {
    const i = !!a, [l, u] = s.split("=").reverse();
    if (u) {
      if (u === "u-ca")
        r.push(l), t || (t = i);
      else if (i || /[A-Z]/.test(u))
        throw new RangeError(bt(o));
    } else {
      if (n)
        throw new RangeError(bt(o));
      n = l;
    }
    return "";
  }), r.length > 1 && t)
    throw new RangeError(bt(e));
  return {
    timeZone: n,
    calendar: r[0] || ie
  };
}
function Ba(e) {
  return parseInt(e.padEnd(9, "0"));
}
function jn(e) {
  return new RegExp(`^${e}$`, "i");
}
function La(e) {
  return e && e !== "+" ? -1 : 1;
}
function wn(e) {
  return e === void 0 ? 0 : parseInt(e);
}
function jf(e) {
  return Ua(Te(e));
}
function Ua(e) {
  const t = Za(e);
  return typeof t == "number" ? fr(t) : t ? ((n) => {
    if (X1.test(n))
      throw new RangeError(lu(n));
    if (Q1.test(n))
      throw new RangeError(Jp);
    return n.toLowerCase().split("/").map((r, o) => (r.length <= 3 || /\d/.test(r)) && !/etc|yap/.test(r) ? r.toUpperCase() : r.replace(/baja|dumont|[a-z]+/g, (a, s) => a.length <= 2 && !o || a === "in" || a === "chat" ? a.toUpperCase() : a.length > 2 || !s ? Zs(a).replace(/island|noronha|murdo|rivadavia|urville/, Zs) : a)).join("/");
  })(e) : mn;
}
function ci(e) {
  const t = Za(e);
  return typeof t == "number" ? t : t ? t.resolvedOptions().timeZone : mn;
}
function Za(e) {
  const t = Pa(e = e.toUpperCase(), 1);
  return t !== void 0 ? t : e !== mn ? J1(e) : void 0;
}
function Dl(e, t) {
  return We(e.epochNanoseconds, t.epochNanoseconds);
}
function Tl(e, t) {
  return We(e.epochNanoseconds, t.epochNanoseconds);
}
function Rf(e, t, n, r, o, a) {
  const s = e(ht(a).relativeTo), i = Math.max(an(r), an(o));
  if (Yi(fe, r, o))
    return 0;
  if (rr(i, s))
    return We(Ee(r), Ee(o));
  if (!s)
    throw new RangeError(wo);
  const [l, u, c] = po(t, n, s), f = Ta(c), d = mo(c);
  return We(f(d(u, l, r)), f(d(u, l, o)));
}
function Nl(e, t) {
  return Rn(e, t) || Ya(e, t);
}
function Rn(e, t) {
  return Vt(Fe(e), Fe(t));
}
function Ya(e, t) {
  return Vt(Lt(e), Lt(t));
}
function Ff(e, t) {
  return !Dl(e, t);
}
function Vf(e, t) {
  return !Tl(e, t) && !!jl(e.timeZone, t.timeZone) && e.calendar === t.calendar;
}
function Af(e, t) {
  return !Nl(e, t) && e.calendar === t.calendar;
}
function Pf(e, t) {
  return !Rn(e, t) && e.calendar === t.calendar;
}
function Bf(e, t) {
  return !Rn(e, t) && e.calendar === t.calendar;
}
function Lf(e, t) {
  return !Rn(e, t) && e.calendar === t.calendar;
}
function Uf(e, t) {
  return !Ya(e, t);
}
function jl(e, t) {
  if (e === t)
    return 1;
  try {
    return ci(e) === ci(t);
  } catch {
  }
}
function di(e, t, n, r) {
  const o = Dn(e, r, 3, 5), a = go(t.epochNanoseconds, n.epochNanoseconds, ...o);
  return xe(e ? Ae(a) : a);
}
function fi(e, t, n, r, o, a) {
  const s = bo(r.calendar, o.calendar), [i, l, u, c] = Dn(n, a, 5), f = r.epochNanoseconds, d = o.epochNanoseconds, h = We(d, f);
  let v;
  if (h)
    if (i < 6)
      v = go(f, d, i, l, u, c);
    else {
      const w = t(((_, C) => {
        if (!jl(_, C))
          throw new RangeError(uu);
        return _;
      })(r.timeZone, o.timeZone)), y = e(s);
      v = Fl(y, w, r, o, h, i, a), v = lo(v, d, i, l, u, c, y, r, dl, se(Ea, w));
    }
  else
    v = De;
  return xe(n ? Ae(v) : v);
}
function pi(e, t, n, r, o) {
  const a = bo(n.calendar, r.calendar), [s, i, l, u] = Dn(t, o, 6), c = Oe(n), f = Oe(r), d = We(f, c);
  let h;
  if (d)
    if (s <= 6)
      h = go(c, f, s, i, l, u);
    else {
      const v = e(a);
      h = Vl(v, n, r, d, s, o), h = lo(h, f, s, i, l, u, v, n, Oe, Da);
    }
  else
    h = De;
  return xe(t ? Ae(h) : h);
}
function mi(e, t, n, r, o) {
  const a = bo(n.calendar, r.calendar);
  return Rl(t, () => e(a), n, r, ...Dn(t, o, 6, 9, 6));
}
function hi(e, t, n, r, o) {
  const a = bo(n.calendar, r.calendar), s = Dn(t, o, 9, 9, 8), i = e(a), l = nr(i, n), u = nr(i, r);
  return l.isoYear === u.isoYear && l.isoMonth === u.isoMonth && l.isoDay === u.isoDay ? xe(De) : Rl(t, () => i, Qe(l), Qe(u), ...s, 8);
}
function Rl(e, t, n, r, o, a, s, i, l = 6) {
  const u = Oe(n), c = Oe(r);
  if (u === void 0 || c === void 0)
    throw new RangeError(Qt);
  let f;
  if (We(c, u))
    if (o === 6)
      f = go(u, c, o, a, s, i);
    else {
      const d = t();
      f = d.N(n, r, o), a === l && s === 1 || (f = lo(f, c, o, a, s, i, d, n, Oe, fo));
    }
  else
    f = De;
  return xe(e ? Ae(f) : f);
}
function vi(e, t, n, r) {
  const [o, a, s, i] = Dn(e, r, 5, 5), l = Ut(qa(t, n), dr(a, s), i), u = {
    ...De,
    ...ho(l, o)
  };
  return xe(e ? Ae(u) : u);
}
function Zf(e, t, n, r, o, a) {
  const s = We(r.epochNanoseconds, n.epochNanoseconds);
  return s ? o < 6 ? Al(n.epochNanoseconds, r.epochNanoseconds, o) : Fl(t, e, n, r, s, o, a) : De;
}
function Yf(e, t, n, r, o) {
  const a = Oe(t), s = Oe(n), i = We(s, a);
  return i ? r <= 6 ? Al(a, s, r) : Vl(e, t, n, i, r, o) : De;
}
function Fl(e, t, n, r, o, a, s) {
  const [i, l, u] = ((d, h, v, w) => {
    function y() {
      return R = {
        ...cn($, N++ * -w),
        ...C
      }, Z = pr(d, R), We(O, Z) === -w;
    }
    const _ = Ge(h, d), C = et(rt, _), $ = Ge(v, d), O = v.epochNanoseconds;
    let N = 0;
    const j = qa(_, $);
    let R, Z;
    if (Math.sign(j) === -w && N++, y() && (w === -1 || y()))
      throw new RangeError(Fn);
    const D = ft(dt(Z, O));
    return [_, R, D];
  })(t, n, r, o);
  var c, f;
  return {
    ...a === 6 ? (c = i, f = l, {
      ...De,
      days: Pl(c, f)
    }) : e.N(i, l, a, s),
    ...ho(u)
  };
}
function Vl(e, t, n, r, o, a) {
  const [s, i, l] = ((u, c, f) => {
    let d = c, h = qa(u, c);
    return Math.sign(h) === -f && (d = cn(c, -f), h += ve * f), [u, d, h];
  })(t, n, r);
  return {
    ...e.N(s, i, o, a),
    ...ho(l)
  };
}
function go(e, t, n, r, o, a) {
  return {
    ...De,
    ...Nn(uo(dt(e, t), r, o, a), n)
  };
}
function Al(e, t, n) {
  return {
    ...De,
    ...Nn(dt(e, t), n)
  };
}
function Pl(e, t) {
  return yo(Fe(e), Fe(t));
}
function yo(e, t) {
  return Math.trunc((t - e) / Ue);
}
function qa(e, t) {
  return Lt(t) - Lt(e);
}
function bo(e, t) {
  if (e !== t)
    throw new RangeError(iu);
  return e;
}
function Bl(e) {
  return this.m(e)[0];
}
function Ll(e) {
  return this.m(e)[1];
}
function za(e) {
  const [t] = this.v(e);
  return yo(this.p(t), Fe(e)) + 1;
}
function Wa(e) {
  const t = K1.exec(e);
  if (!t)
    throw new RangeError(Hp(e));
  return [parseInt(t[1]), !!t[2]];
}
function mr(e, t) {
  return "M" + Xe(e) + (t ? "L" : "");
}
function zr(e, t, n) {
  return e + (t || n && e >= n ? 1 : 0);
}
function Ha(e, t) {
  return e - (t && e >= t ? 1 : 0);
}
function Ul(e, t) {
  return (t + e) * (Math.sign(t) || 1) || 0;
}
function Zo(e) {
  return yu[Yl(e)];
}
function Zl(e) {
  return d1[Yl(e)];
}
function Yl(e) {
  return sn(e.id || ie);
}
function qf(e) {
  function t(o) {
    return ((a, s) => ({
      ...ql(a, s),
      o: a.month,
      day: parseInt(a.day)
    }))(ha(n, o), r);
  }
  const n = ys(e), r = sn(e);
  return {
    id: e,
    h: zf(t),
    l: Wf(t)
  };
}
function zf(e) {
  return ze((t) => {
    const n = Fe(t);
    return e(n);
  }, WeakMap);
}
function Wf(e) {
  const t = e(0).year - w1;
  return ze((n) => {
    let r, o = In(n - t), a = 0;
    const s = [], i = [];
    do
      o += 400 * Ue;
    while ((r = e(o)).year <= n);
    do
      if (o += (1 - r.day) * Ue, r.year === n && (s.push(o), i.push(r.o)), o -= Ue, ++a > 100 || o < -ls)
        throw new RangeError(Fn);
    while ((r = e(o)).year >= n);
    return {
      i: s.reverse(),
      u: cu(i.reverse())
    };
  });
}
function ql(e, t) {
  let n, r, o = zl(e);
  if (e.era) {
    const a = yu[t], s = bu[t] || {};
    a !== void 0 && (n = t === "islamic" ? "ah" : e.era.normalize("NFD").toLowerCase().replace(/[^a-z0-9]/g, ""), n === "bc" || n === "b" ? n = "bce" : n === "ad" || n === "a" ? n = "ce" : n === "beforeroc" && (n = "broc"), n = s[n] || n, r = o, o = Ul(r, a[n] || 0));
  }
  return {
    era: n,
    eraYear: r,
    year: o
  };
}
function zl(e) {
  return parseInt(e.relatedYear || e.year);
}
function Wr(e) {
  const { year: t, o: n, day: r } = this.h(e), { u: o } = this.l(t);
  return [t, o[n] + 1, r];
}
function or(e, t = 1, n = 1) {
  return this.l(e).i[t - 1] + (n - 1) * Ue;
}
function Wl(e, t) {
  const n = Vr.call(this, e);
  return [Ha(t, n), n === t];
}
function Vr(e) {
  const t = yi(this, e), n = yi(this, e - 1), r = t.length;
  if (r > n.length) {
    const o = Zl(this);
    if (o < 0)
      return -o;
    for (let a = 0; a < r; a++)
      if (t[a] !== n[a])
        return a + 1;
  }
}
function Tr(e) {
  return yo(or.call(this, e), or.call(this, e + 1));
}
function gi(e, t) {
  const { i: n } = this.l(e);
  let r = t + 1, o = n;
  return r > n.length && (r = 1, o = this.l(e + 1).i), yo(n[t - 1], o[r - 1]);
}
function Nr(e) {
  return this.l(e).i.length;
}
function Hl(e) {
  const t = this.h(e);
  return [t.era, t.eraYear];
}
function yi(e, t) {
  return Object.keys(e.l(t).u);
}
function hr(e) {
  return _o(Te(e));
}
function _o(e) {
  if ((e = e.toLowerCase()) !== ie && e !== Vn) {
    const t = ys(e).resolvedOptions().calendar;
    if (sn(e) !== sn(t))
      throw new RangeError(su(e));
    return t;
  }
  return e;
}
function sn(e) {
  return e === "islamicc" && (e = "islamic"), e.split("-")[0];
}
function Gl(e, t) {
  return (n) => n === ie ? e : n === Vn || n === Yt ? Object.assign(Object.create(e), {
    id: n
  }) : Object.assign(Object.create(t), em(n));
}
function Hf(e, t, n, r) {
  const o = Ht(n, r, Et, [], mu);
  if (o.timeZone !== void 0) {
    const a = n.F(o), s = vr(o), i = e(o.timeZone);
    return {
      epochNanoseconds: Tn(t(i), {
        ...a,
        ...s
      }, o.offset !== void 0 ? fn(o.offset) : void 0),
      timeZone: i
    };
  }
  return {
    ...n.F(o),
    ...Ye
  };
}
function Gf(e, t, n, r, o, a) {
  const s = Ht(n, o, Et, fu, mu), i = e(s.timeZone), [l, u, c] = oo(a), f = n.F(s, io(l)), d = vr(s, l);
  return tt(Tn(t(i), {
    ...f,
    ...d
  }, s.offset !== void 0 ? fn(s.offset) : void 0, u, c), i, r);
}
function Jf(e, t, n) {
  const r = Ht(e, t, Et, [], Ot), o = ce(n);
  return nt(Ze({
    ...e.F(r, io(o)),
    ...vr(r, o)
  }));
}
function Qf(e, t, n, r = []) {
  const o = Ht(e, t, Et, r);
  return e.F(o, n);
}
function Xf(e, t, n, r) {
  const o = Ht(e, t, ts, r);
  return e.K(o, n);
}
function Kf(e, t, n, r) {
  const o = Ht(e, n, Et, yr);
  return t && o.month !== void 0 && o.monthCode === void 0 && o.year === void 0 && (o.year = _t), e._(o, r);
}
function ep(e, t) {
  return vt(vr(He(e, Wo, [], 1), ce(t)));
}
function tp(e) {
  const t = He(e, ns);
  return xe(dn({
    ...De,
    ...t
  }));
}
function Ht(e, t, n, r = [], o = []) {
  return He(t, [...e.fields(n), ...o].sort(), r);
}
function He(e, t, n, r = !n) {
  const o = {};
  let a, s = 0;
  for (const i of t) {
    if (i === a)
      throw new RangeError(Bp(i));
    if (i === "constructor" || i === "__proto__")
      throw new RangeError(Pp(i));
    let l = e[i];
    if (l !== void 0)
      s = 1, _i[i] && (l = _i[i](l, i)), o[i] = l;
    else if (n) {
      if (n.includes(i))
        throw new TypeError(Ja(i));
      o[i] = gu[i];
    }
    a = i;
  }
  if (r && !s)
    throw new TypeError(ru(t));
  return o;
}
function vr(e, t) {
  return En(bs({
    ...gu,
    ...e
  }), t);
}
function np(e, t, n, r, o) {
  const { calendar: a, timeZone: s } = n, i = e(a), l = t(s), u = [...i.fields(Et), ...pu].sort(), c = ((_) => {
    const C = Ge(_, K), $ = fr(C.offsetNanoseconds), O = Mo(_.calendar), [N, j, R] = O.v(C), [Z, D] = O.q(N, j), z = mr(Z, D);
    return {
      ...lm(C),
      year: N,
      monthCode: z,
      day: R,
      offset: $
    };
  })(n), f = He(r, u), d = i.k(c, f), h = {
    ...c,
    ...f
  }, [v, w, y] = oo(o, 2);
  return tt(Tn(l, {
    ...i.F(d, io(v)),
    ...En(bs(h), v)
  }, fn(h.offset), w, y), s, a);
}
function rp(e, t, n, r) {
  const o = e(t.calendar), a = [...o.fields(Et), ...Ot].sort(), s = {
    ...Ql(i = t),
    hour: i.isoHour,
    minute: i.isoMinute,
    second: i.isoSecond,
    millisecond: i.isoMillisecond,
    microsecond: i.isoMicrosecond,
    nanosecond: i.isoNanosecond
  };
  var i;
  const l = He(n, a), u = ce(r), c = o.k(s, l), f = {
    ...s,
    ...l
  };
  return nt(Ze({
    ...o.F(c, io(u)),
    ...En(bs(f), u)
  }));
}
function op(e, t, n, r) {
  const o = e(t.calendar), a = o.fields(Et).sort(), s = Ql(t), i = He(n, a), l = o.k(s, i);
  return o.F(l, r);
}
function ap(e, t, n, r) {
  const o = e(t.calendar), a = o.fields(ts).sort(), s = ((u) => {
    const c = Mo(u.calendar), [f, d] = c.v(u), [h, v] = c.q(f, d);
    return {
      year: f,
      monthCode: mr(h, v)
    };
  })(t), i = He(n, a), l = o.k(s, i);
  return o.K(l, r);
}
function sp(e, t, n, r) {
  const o = e(t.calendar), a = o.fields(Et).sort(), s = ((u) => {
    const c = Mo(u.calendar), [f, d, h] = c.v(u), [v, w] = c.q(f, d);
    return {
      monthCode: mr(v, w),
      day: h
    };
  })(t), i = He(n, a), l = o.k(s, i);
  return o._(l, r);
}
function ip(e, t, n) {
  return vt(((r, o, a) => vr({
    ...et(Wo, r),
    ...He(o, Wo)
  }, ce(a)))(e, t, n));
}
function lp(e, t) {
  return xe((n = e, r = t, dn({
    ...n,
    ...He(r, ns)
  })));
  var n, r;
}
function Jl(e, t, n, r, o) {
  t = et(n = e.fields(n), t), r = He(r, o = e.fields(o), []);
  let a = e.k(t, r);
  return a = He(a, [...n, ...o].sort(), []), e.F(a);
}
function No(e, t) {
  const n = Zo(e), r = bu[e.id || ""] || {};
  let { era: o, eraYear: a, year: s } = t;
  if (o !== void 0 || a !== void 0) {
    if (o === void 0 || a === void 0)
      throw new TypeError(Yp);
    if (!n)
      throw new RangeError(Zp);
    const i = n[r[o] || o];
    if (i === void 0)
      throw new RangeError(zp(o));
    const l = Ul(a, i);
    if (s !== void 0 && s !== l)
      throw new RangeError(qp);
    s = l;
  } else if (s === void 0)
    throw new TypeError(Wp(n));
  return s;
}
function jr(e, t, n, r) {
  let { month: o, monthCode: a } = t;
  if (a !== void 0) {
    const s = ((i, l, u, c) => {
      const f = i.L(u), [d, h] = Wa(l);
      let v = zr(d, h, f);
      if (h) {
        const w = Zl(i);
        if (w === void 0)
          throw new RangeError(qn);
        if (w > 0) {
          if (v > w)
            throw new RangeError(qn);
          if (f === void 0) {
            if (c === 1)
              throw new RangeError(qn);
            v--;
          }
        } else {
          if (v !== -w)
            throw new RangeError(qn);
          if (f === void 0 && c === 1)
            throw new RangeError(qn);
        }
      }
      return v;
    })(e, a, n, r);
    if (o !== void 0 && o !== s)
      throw new RangeError(Gp);
    o = s, r = 1;
  } else if (o === void 0)
    throw new TypeError(au);
  return Ct("month", o, 1, e.B(n), r);
}
function jo(e, t, n, r, o) {
  return Be(t, "day", 1, e.U(r, n), o);
}
function Ro(e, t, n, r) {
  let o = 0;
  const a = [];
  for (const s of n)
    t[s] !== void 0 ? o = 1 : a.push(s);
  if (Object.assign(e, t), o)
    for (const s of r || a)
      delete e[s];
}
function Ql(e) {
  const t = Mo(e.calendar), [n, r, o] = t.v(e), [a, s] = t.q(n, r);
  return {
    year: n,
    monthCode: mr(a, s),
    day: o
  };
}
function up(e) {
  return Mt(mt(da(la(e))));
}
function cp(e, t, n, r, o = ie) {
  return tt(mt(da(la(n))), t(r), e(o));
}
function dp(e, t, n, r, o = 0, a = 0, s = 0, i = 0, l = 0, u = 0, c = ie) {
  return nt(Ze(ro(xt(je, Sn(Co, [t, n, r, o, a, s, i, l, u])))), e(c));
}
function fp(e, t, n, r, o = ie) {
  return St(Qe(un(xt(je, {
    isoYear: t,
    isoMonth: n,
    isoDay: r
  }))), e(o));
}
function pp(e, t, n, r = ie, o = 1) {
  const a = je(t), s = je(n), i = e(r);
  return tr(pa(un({
    isoYear: a,
    isoMonth: s,
    isoDay: je(o)
  })), i);
}
function mp(e, t, n, r = ie, o = _t) {
  const a = je(t), s = je(n), i = e(r);
  return Zr(Qe(un({
    isoYear: je(o),
    isoMonth: a,
    isoDay: s
  })), i);
}
function hp(e = 0, t = 0, n = 0, r = 0, o = 0, a = 0) {
  return vt(En(xt(je, Sn(rt, [e, t, n, r, o, a])), 1));
}
function vp(e = 0, t = 0, n = 0, r = 0, o = 0, a = 0, s = 0, i = 0, l = 0, u = 0) {
  return xe(dn(xt(ua, Sn(fe, [e, t, n, r, o, a, s, i, l, u]))));
}
function gp(e, t, n = ie) {
  return tt(e.epochNanoseconds, t, n);
}
function yp(e) {
  return Mt(e.epochNanoseconds);
}
function Xl(e, t) {
  return nt(Ge(t, e));
}
function Kl(e, t) {
  return St(Ge(t, e));
}
function eu(e, t) {
  return vt(Ge(t, e));
}
function bp(e, t, n, r) {
  const o = ((a, s, i, l) => {
    const u = ((c) => Su(ht(c)))(l);
    return pr(a(s), i, u);
  })(e, n, t, r);
  return tt(mt(o), n, t.calendar);
}
function _p(e, t, n, r, o) {
  const a = e(o.timeZone), s = o.plainTime, i = s !== void 0 ? t(s) : void 0, l = n(a);
  let u;
  return u = i ? pr(l, {
    ...r,
    ...i
  }) : Zt(l, {
    ...r,
    ...Ye
  }), tt(u, a, r.calendar);
}
function wp(e, t = Ye) {
  return nt(Ze({
    ...e,
    ...t
  }));
}
function kp(e, t, n) {
  return ((r, o) => {
    const a = Ht(r, o, hu);
    return r.K(a, void 0);
  })(e(t.calendar), n);
}
function $p(e, t, n) {
  return ((r, o) => {
    const a = Ht(r, o, vu);
    return r._(a);
  })(e(t.calendar), n);
}
function Cp(e, t, n, r) {
  return ((o, a, s) => Jl(o, a, hu, cr(s), yr))(e(t.calendar), n, r);
}
function xp(e, t, n, r) {
  return ((o, a, s) => Jl(o, a, vu, cr(s), Xa))(e(t.calendar), n, r);
}
function Mp(e) {
  return Mt(mt(Lr(ua(e), It)));
}
function Sp(e) {
  return Mt(mt(da(la(e))));
}
function pn(e, t, n) {
  const r = new Set(n);
  return (o, a) => {
    const s = n && Us(o, n);
    if (!Us(o = ((i, l) => {
      const u = {};
      for (const c in l)
        i.has(c) || (u[c] = l[c]);
      return u;
    })(r, o), e)) {
      if (a && s)
        throw new TypeError("Invalid formatting options");
      o = {
        ...t,
        ...o
      };
    }
    return n && (o.timeZone = mn, ["full", "long"].includes(o.J) && (o.J = "medium")), o;
  };
}
function Gt(e, t = tu, n = 0) {
  const [r, , , o] = e;
  return (a, s = Sm, ...i) => {
    const l = t(o && o(...i), a, s, r, n), u = l.resolvedOptions();
    return [l, ...Ip(e, u, i)];
  };
}
function tu(e, t, n, r, o) {
  if (n = r(n, o), e) {
    if (n.timeZone !== void 0)
      throw new TypeError(i1);
    n.timeZone = e;
  }
  return new At(t, n);
}
function Ip(e, t, n) {
  const [, r, o] = e;
  return n.map((a) => (a.calendar && ((s, i, l) => {
    if ((l || s !== ie) && s !== i)
      throw new RangeError(iu);
  })(a.calendar, t.calendar, o), r(a, t)));
}
function Op(e, t, n) {
  const r = t.timeZone, o = e(r), a = {
    ...Ge(t, o),
    ...n || Ye
  };
  let s;
  return s = n ? Tn(o, a, a.offsetNanoseconds, 2) : Zt(o, a), tt(s, r, t.calendar);
}
function Ep(e, t = Ye) {
  return nt(Ze({
    ...e,
    ...t
  }));
}
function Ga(e, t) {
  return {
    ...e,
    calendar: t
  };
}
function Dp(e, t) {
  return {
    ...e,
    timeZone: t
  };
}
function Fo(e) {
  const t = Yo();
  return On(t, e.R(t));
}
function Yo() {
  return Lr(Date.now(), It);
}
function Yn() {
  return wi || (wi = new At().resolvedOptions().timeZone);
}
const Tp = (e, t) => `Non-integer ${e}: ${t}`, Np = (e, t) => `Non-positive ${e}: ${t}`, jp = (e, t) => `Non-finite ${e}: ${t}`, Rp = (e) => `Cannot convert bigint to ${e}`, Fp = (e) => `Invalid bigint: ${e}`, Vp = "Cannot convert Symbol to string", Ap = "Invalid object", nu = (e, t, n, r, o) => o ? nu(e, o[t], o[n], o[r]) : Jt(e, t) + `; must be between ${n}-${r}`, Jt = (e, t) => `Invalid ${e}: ${t}`, Ja = (e) => `Missing ${e}`, Pp = (e) => `Invalid field ${e}`, Bp = (e) => `Duplicate field ${e}`, ru = (e) => "No valid fields: " + e.join(), Lp = "Invalid bag", ou = (e, t, n) => Jt(e, t) + "; must be " + Object.keys(n).join(), Up = "Cannot use valueOf", qo = "Invalid calling context", Zp = "Forbidden era/eraYear", Yp = "Mismatching era/eraYear", qp = "Mismatching year/eraYear", zp = (e) => `Invalid era: ${e}`, Wp = (e) => "Missing year" + (e ? "/era/eraYear" : ""), Hp = (e) => `Invalid monthCode: ${e}`, Gp = "Mismatching month/monthCode", au = "Missing month/monthCode", qn = "Invalid leap month", Fn = "Invalid protocol results", su = (e) => Jt("Calendar", e), iu = "Mismatching Calendars", lu = (e) => Jt("TimeZone", e), uu = "Mismatching TimeZones", Jp = "Forbidden ICU TimeZone", Qp = "Out-of-bounds offset", Xp = "Out-of-bounds TimeZone gap", Kp = "Invalid TimeZone offset", e1 = "Ambiguous offset", Qt = "Out-of-bounds date", t1 = "Out-of-bounds duration", n1 = "Cannot mix duration signs", wo = "Missing relativeTo", r1 = "Cannot use large units", o1 = "Required smallestUnit or largestUnit", a1 = "smallestUnit > largestUnit", Le = (e) => `Cannot parse: ${e}`, bt = (e) => `Invalid substring: ${e}`, s1 = (e) => `Cannot format ${e}`, Vo = "Mismatching types for formatting", i1 = "Cannot specify TimeZone", cu = /* @__PURE__ */ se(Xr, (e, t) => t), xn = /* @__PURE__ */ se(Xr, (e, t, n) => n), Xe = /* @__PURE__ */ se(Br, 2), zo = {
  nanosecond: 0,
  microsecond: 1,
  millisecond: 2,
  second: 3,
  minute: 4,
  hour: 5,
  day: 6,
  week: 7,
  month: 8,
  year: 9
}, Qa = /* @__PURE__ */ Object.keys(zo), Ue = 864e5, du = 1e3, gr = 1e3, It = 1e6, ut = 1e9, ko = 6e10, $o = 36e11, ve = 864e11, pt = [1, gr, It, ut, ko, $o, ve], Ot = /* @__PURE__ */ Qa.slice(0, 6), Wo = /* @__PURE__ */ ur(Ot), l1 = ["offset"], fu = ["timeZone"], pu = /* @__PURE__ */ Ot.concat(l1), mu = /* @__PURE__ */ pu.concat(fu), Ho = ["era", "eraYear"], u1 = /* @__PURE__ */ Ho.concat(["year"]), Xa = ["year"], Ka = ["monthCode"], es = /* @__PURE__ */ ["month"].concat(Ka), yr = ["day"], ts = /* @__PURE__ */ es.concat(Xa), hu = /* @__PURE__ */ Ka.concat(Xa), Et = /* @__PURE__ */ yr.concat(ts), c1 = /* @__PURE__ */ yr.concat(es), vu = /* @__PURE__ */ yr.concat(Ka), gu = /* @__PURE__ */ xn(Ot, 0), ie = "iso8601", Vn = "gregory", Yt = "japanese", yu = {
  [Vn]: {
    "gregory-inverse": -1,
    gregory: 0
  },
  [Yt]: {
    "japanese-inverse": -1,
    japanese: 0,
    meiji: 1867,
    taisho: 1911,
    showa: 1925,
    heisei: 1988,
    reiwa: 2018
  },
  ethiopic: {
    ethioaa: 0,
    ethiopic: 5500
  },
  coptic: {
    "coptic-inverse": -1,
    coptic: 0
  },
  roc: {
    "roc-inverse": -1,
    roc: 0
  },
  buddhist: {
    be: 0
  },
  islamic: {
    ah: 0
  },
  indian: {
    saka: 0
  },
  persian: {
    ap: 0
  }
}, bu = {
  [Vn]: {
    bce: "gregory-inverse",
    ce: "gregory"
  },
  [Yt]: {
    bce: "japanese-inverse",
    ce: "japanese"
  },
  ethiopic: {
    era0: "ethioaa",
    era1: "ethiopic"
  },
  coptic: {
    era0: "coptic-inverse",
    era1: "coptic"
  },
  roc: {
    broc: "roc-inverse",
    minguo: "roc"
  }
}, d1 = {
  chinese: 13,
  dangi: 13,
  hebrew: -6
}, Te = /* @__PURE__ */ se(sa, "string"), f1 = /* @__PURE__ */ se(sa, "boolean"), p1 = /* @__PURE__ */ se(sa, "number"), fe = /* @__PURE__ */ Qa.map((e) => e + "s"), ns = /* @__PURE__ */ ur(fe), m1 = /* @__PURE__ */ fe.slice(0, 6), _u = /* @__PURE__ */ fe.slice(6), h1 = /* @__PURE__ */ _u.slice(1), v1 = /* @__PURE__ */ cu(fe), De = /* @__PURE__ */ xn(fe, 0), rs = /* @__PURE__ */ xn(m1, 0), os = /* @__PURE__ */ se(qi, fe), rt = ["isoNanosecond", "isoMicrosecond", "isoMillisecond", "isoSecond", "isoMinute", "isoHour"], as = ["isoDay", "isoMonth", "isoYear"], Co = /* @__PURE__ */ rt.concat(as), ss = /* @__PURE__ */ ur(as), wu = /* @__PURE__ */ ur(rt), g1 = /* @__PURE__ */ ur(Co), Ye = /* @__PURE__ */ xn(wu, 0), y1 = /* @__PURE__ */ se(qi, Co), is = 1e8, ls = is * Ue, b1 = [is, 0], _1 = [-is, 0], ar = 275760, sr = -271821, At = Intl.DateTimeFormat, ku = "en-GB", w1 = 1970, _t = 1972, Tt = 12, k1 = /* @__PURE__ */ In(1868, 9, 8), $1 = /* @__PURE__ */ ze(rf, WeakMap), Hr = "smallestUnit", Go = "unit", Qn = "roundingIncrement", Ao = "fractionalSecondDigits", $u = "relativeTo", Po = "direction", Cu = {
  constrain: 0,
  reject: 1
}, C1 = /* @__PURE__ */ Object.keys(Cu), x1 = {
  compatible: 0,
  reject: 1,
  earlier: 2,
  later: 3
}, M1 = {
  reject: 0,
  use: 1,
  prefer: 2,
  ignore: 3
}, S1 = {
  auto: 0,
  never: 1,
  critical: 2,
  always: 3
}, I1 = {
  auto: 0,
  never: 1,
  critical: 2
}, O1 = {
  auto: 0,
  never: 1
}, E1 = {
  floor: 0,
  halfFloor: 1,
  ceil: 2,
  halfCeil: 3,
  trunc: 4,
  halfTrunc: 5,
  expand: 6,
  halfExpand: 7,
  halfEven: 8
}, D1 = {
  previous: -1,
  next: 1
}, br = /* @__PURE__ */ se(ka, Hr), xu = /* @__PURE__ */ se(ka, "largestUnit"), T1 = /* @__PURE__ */ se(ka, Go), Mu = /* @__PURE__ */ se(qt, "overflow", Cu), Su = /* @__PURE__ */ se(qt, "disambiguation", x1), N1 = /* @__PURE__ */ se(qt, "offset", M1), us = /* @__PURE__ */ se(qt, "calendarName", S1), j1 = /* @__PURE__ */ se(qt, "timeZoneName", I1), R1 = /* @__PURE__ */ se(qt, "offset", O1), _r = /* @__PURE__ */ se(qt, "roundingMode", E1), cs = "PlainYearMonth", ds = "PlainMonthDay", wr = "PlainDate", An = "PlainDateTime", fs = "PlainTime", Xt = "ZonedDateTime", ps = "Instant", ms = "Duration", F1 = [Math.floor, (e) => Dr(e) ? Math.floor(e) : Math.round(e), Math.ceil, (e) => Dr(e) ? Math.ceil(e) : Math.round(e), Math.trunc, (e) => Dr(e) ? Math.trunc(e) || 0 : Math.round(e), (e) => e < 0 ? Math.floor(e) : Math.ceil(e), (e) => Math.sign(e) * Math.round(Math.abs(e)) || 0, (e) => Dr(e) ? (e = Math.trunc(e) || 0) + e % 2 : Math.round(e)], mn = "UTC", Ar = 5184e3, V1 = /* @__PURE__ */ Ur(1847), A1 = /* @__PURE__ */ Ur(/* @__PURE__ */ (/* @__PURE__ */ new Date()).getUTCFullYear() + 10), P1 = /0+$/, Ge = /* @__PURE__ */ ze(bf, WeakMap), bi = 2 ** 32 - 1, K = /* @__PURE__ */ ze((e) => {
  const t = Za(e);
  return typeof t == "object" ? new L1(t) : new B1(t || 0);
});
class B1 {
  constructor(t) {
    this.$ = t;
  }
  R() {
    return this.$;
  }
  I(t) {
    return ((n) => {
      const r = Oe({
        ...n,
        ...Ye
      });
      if (!r || Math.abs(r[0]) > 1e8)
        throw new RangeError(Qt);
    })(t), [ma(t, this.$)];
  }
  O() {
  }
}
class L1 {
  constructor(t) {
    this.nn = ((n) => {
      function r(u) {
        const c = er(u, i, l), [f, d] = ui(c), h = a(f), v = a(d);
        return h === v ? h : o(s(f, d), h, v, u);
      }
      function o(u, c, f, d) {
        let h, v;
        for (; (d === void 0 || (h = d < u[0] ? c : d >= u[1] ? f : void 0) === void 0) && (v = u[1] - u[0]); ) {
          const w = u[0] + Math.floor(v / 2);
          n(w) === f ? u[1] = w : u[0] = w + 1;
        }
        return h;
      }
      const a = ze(n), s = ze($f);
      let i = V1, l = A1;
      return {
        tn(u) {
          const c = r(u - 86400), f = r(u + 86400), d = u - c, h = u - f;
          if (c === f)
            return [d];
          const v = r(d);
          return v === r(h) ? [u - v] : c > f ? [d, h] : [];
        },
        rn: r,
        O(u, c) {
          const f = er(u, i, l);
          let [d, h] = ui(f);
          const v = Ar * c, w = c < 0 ? () => h > i || (i = f, 0) : () => d < l || (l = f, 0);
          for (; w(); ) {
            const y = a(d), _ = a(h);
            if (y !== _) {
              const C = s(d, h);
              o(C, y, _);
              const $ = C[0];
              if ((Vt($, u) || 1) === c)
                return $;
            }
            d += v, h += v;
          }
        }
      };
    })(/* @__PURE__ */ ((n) => (r) => {
      const o = ha(n, r * du);
      return Ur(zl(o), parseInt(o.month), parseInt(o.day), parseInt(o.hour), parseInt(o.minute), parseInt(o.second)) - r;
    })(t));
  }
  R(t) {
    return this.nn.rn(((n) => qs(n)[0])(t)) * ut;
  }
  I(t) {
    const [n, r] = [Ur((o = t).isoYear, o.isoMonth, o.isoDay, o.isoHour, o.isoMinute, o.isoSecond), o.isoMillisecond * It + o.isoMicrosecond * gr + o.isoNanosecond];
    var o;
    return this.nn.tn(n).map((a) => mt(on(Lr(a, ut), r)));
  }
  O(t, n) {
    const [r, o] = qs(t), a = this.nn.O(r + (n > 0 || o ? 1 : 0), n);
    if (a !== void 0)
      return Lr(a, ut);
  }
}
const hs = "([+-])", Pr = "(?:[.,](\\d{1,9}))?", Iu = `(?:(?:${hs}(\\d{6}))|(\\d{4}))-?(\\d{2})`, vs = "(\\d{2})(?::?(\\d{2})(?::?(\\d{2})" + Pr + ")?)?", gs = hs + vs, U1 = Iu + "-?(\\d{2})(?:[T ]" + vs + "(Z|" + gs + ")?)?", Ou = "\\[(!?)([^\\]]*)\\]", xo = `((?:${Ou}){0,9})`, Z1 = /* @__PURE__ */ jn(Iu + xo), Y1 = /* @__PURE__ */ jn("(?:--)?(\\d{2})-?(\\d{2})" + xo), q1 = /* @__PURE__ */ jn(U1 + xo), z1 = /* @__PURE__ */ jn("T?" + vs + "(?:" + gs + ")?" + xo), W1 = /* @__PURE__ */ jn(gs), H1 = /* @__PURE__ */ new RegExp(Ou, "g"), G1 = /* @__PURE__ */ jn(`${hs}?P(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(?:T(?:(\\d+)${Pr}H)?(?:(\\d+)${Pr}M)?(?:(\\d+)${Pr}S)?)?`), J1 = /* @__PURE__ */ ze((e) => new At(ku, {
  timeZone: e,
  era: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
})), Q1 = /^(AC|AE|AG|AR|AS|BE|BS|CA|CN|CS|CT|EA|EC|IE|IS|JS|MI|NE|NS|PL|PN|PR|PS|SS|VS)T$/, X1 = /[^\w\/:+-]+/, K1 = /^M(\d{2})(L?)$/, em = /* @__PURE__ */ ze(qf), ys = /* @__PURE__ */ ze((e) => new At(ku, {
  calendar: e,
  timeZone: mn,
  era: "short",
  year: "numeric",
  month: "short",
  day: "numeric"
})), Eu = {
  P(e, t, n) {
    const r = ce(n);
    let o, { years: a, months: s, weeks: i, days: l } = t;
    if (l += Ee(t, 5)[0], a || s)
      o = ((u, c, f, d, h) => {
        let [v, w, y] = u.v(c);
        if (f) {
          const [_, C] = u.q(v, w);
          v += f, w = zr(_, C, u.L(v)), w = Ct("month", w, 1, u.B(v), h);
        }
        return d && ([v, w] = u.un(v, w, d)), y = Ct("day", y, 1, u.U(v, w), h), u.p(v, w, y);
      })(this, e, a, s, r);
    else {
      if (!i && !l)
        return e;
      o = Fe(e);
    }
    if (o === void 0)
      throw new RangeError(Qt);
    return o += (7 * i + l) * Ue, Qe(no(o));
  },
  N(e, t, n) {
    if (n <= 7) {
      let l = 0, u = Pl({
        ...e,
        ...Ye
      }, {
        ...t,
        ...Ye
      });
      return n === 7 && ([l, u] = Bt(u, 7)), {
        ...De,
        weeks: l,
        days: u
      };
    }
    const r = this.v(e), o = this.v(t);
    let [a, s, i] = ((l, u, c, f, d, h, v) => {
      let w = d - u, y = h - c, _ = v - f;
      if (w || y) {
        const C = Math.sign(w || y);
        let $ = l.U(d, h), O = 0;
        if (Math.sign(_) === -C) {
          const N = $;
          [d, h] = l.un(d, h, -C), w = d - u, y = h - c, $ = l.U(d, h), O = C < 0 ? -N : $;
        }
        if (_ = v - Math.min(f, $) + O, w) {
          const [N, j] = l.q(u, c), [R, Z] = l.q(d, h);
          if (y = R - N || Number(Z) - Number(j), Math.sign(y) === -C) {
            const D = C < 0 && -l.B(d);
            w = (d -= C) - u, y = h - zr(N, j, l.L(d)) + (D || l.B(d));
          }
        }
      }
      return [w, y, _];
    })(this, ...r, ...o);
    return n === 8 && (s += this.cn(a, r[0]), a = 0), {
      ...De,
      years: a,
      months: s,
      days: i
    };
  },
  F(e, t) {
    const n = ce(t), r = No(this, e), o = jr(this, e, r, n), a = jo(this, e, o, r, n);
    return St(Qe(this.V(r, o, a)), this.id || ie);
  },
  K(e, t) {
    const n = ce(t), r = No(this, e), o = jr(this, e, r, n);
    return tr(pa(this.V(r, o, 1)), this.id || ie);
  },
  _(e, t) {
    const n = ce(t);
    let r, o, a, s = e.eraYear !== void 0 || e.year !== void 0 ? No(this, e) : void 0;
    const i = !this.id;
    if (s === void 0 && i && (s = _t), s !== void 0) {
      const f = jr(this, e, s, n);
      r = jo(this, e, f, s, n);
      const d = this.L(s);
      o = Ha(f, d), a = f === d;
    } else {
      if (e.monthCode === void 0)
        throw new TypeError(au);
      if ([o, a] = Wa(e.monthCode), this.id && this.id !== Vn && this.id !== Yt)
        if (this.id && sn(this.id) === "coptic" && n === 0) {
          const f = a || o !== 13 ? 30 : 6;
          r = e.day, r = er(r, 1, f);
        } else if (this.id && sn(this.id) === "chinese" && n === 0) {
          const f = !a || o !== 1 && o !== 9 && o !== 10 && o !== 11 && o !== 12 ? 30 : 29;
          r = e.day, r = er(r, 1, f);
        } else
          r = e.day;
      else
        r = jo(this, e, jr(this, e, _t, n), _t, n);
    }
    const l = this.G(o, a, r);
    if (!l)
      throw new RangeError("Cannot guess year");
    const [u, c] = l;
    return Zr(Qe(this.V(u, c, r)), this.id || ie);
  },
  fields(e) {
    return Zo(this) && e.includes("year") ? [...e, ...Ho] : e;
  },
  k(e, t) {
    const n = Object.assign(/* @__PURE__ */ Object.create(null), e);
    return Ro(n, t, es), Zo(this) && (Ro(n, t, u1), this.id === Yt && Ro(n, t, c1, Ho)), n;
  },
  inLeapYear(e) {
    const [t] = this.v(e);
    return this.sn(t);
  },
  monthsInYear(e) {
    const [t] = this.v(e);
    return this.B(t);
  },
  daysInMonth(e) {
    const [t, n] = this.v(e);
    return this.U(t, n);
  },
  daysInYear(e) {
    const [t] = this.v(e);
    return this.fn(t);
  },
  dayOfYear: za,
  era(e) {
    return this.hn(e)[0];
  },
  eraYear(e) {
    return this.hn(e)[1];
  },
  monthCode(e) {
    const [t, n] = this.v(e), [r, o] = this.q(t, n);
    return mr(r, o);
  },
  dayOfWeek: ol,
  daysInWeek() {
    return 7;
  }
}, tm = {
  v: va,
  hn: al,
  q: el
}, nm = {
  dayOfYear: za,
  v: va,
  p: In
}, rm = /* @__PURE__ */ Object.assign({}, nm, {
  weekOfYear: Bl,
  yearOfWeek: Ll,
  m(e) {
    function t(h) {
      return (7 - h < r ? 7 : 0) - h;
    }
    function n(h) {
      const v = rl(d + h), w = h || 1, y = t(Jn(l + v * w, 7));
      return c = (v + (y - u) * w) / 7;
    }
    const r = this.id ? 1 : 4, o = ol(e), a = this.dayOfYear(e), s = Jn(o - 1, 7), i = a - 1, l = Jn(s - i, 7), u = t(l);
    let c, f = Math.floor((i - u) / 7) + 1, d = e.isoYear;
    return f ? f > n(0) && (f = 1, d++) : (f = n(-1), d--), [f, d, c];
  }
}), om = /* @__PURE__ */ Object.assign({}, Eu, rm, {
  v: va,
  hn: al,
  q: el,
  G(e, t) {
    if (!t)
      return [_t, e];
  },
  sn: ga,
  L() {
  },
  B: tl,
  cn: (e) => e * Tt,
  U: nl,
  fn: rl,
  V: (e, t, n) => ({
    isoYear: e,
    isoMonth: t,
    isoDay: n
  }),
  p: In,
  un: (e, t, n) => (e += Kr(n, Tt), (t += oa(n, Tt)) < 1 ? (e--, t += Tt) : t > Tt && (e++, t -= Tt), [e, t]),
  year(e) {
    return e.isoYear;
  },
  month(e) {
    return e.isoMonth;
  },
  day: (e) => e.isoDay
}), am = {
  v: Wr,
  hn: Hl,
  q: Wl
}, sm = {
  dayOfYear: za,
  v: Wr,
  p: or,
  weekOfYear: Bl,
  yearOfWeek: Ll,
  m() {
    return [];
  }
}, im = /* @__PURE__ */ Object.assign({}, Eu, sm, {
  v: Wr,
  hn: Hl,
  q: Wl,
  G(e, t, n) {
    const r = this.id && sn(this.id) === "chinese" ? ((u, c, f) => {
      if (c)
        switch (u) {
          case 1:
            return 1651;
          case 2:
            return f < 30 ? 1947 : 1765;
          case 3:
            return f < 30 ? 1966 : 1955;
          case 4:
            return f < 30 ? 1963 : 1944;
          case 5:
            return f < 30 ? 1971 : 1952;
          case 6:
            return f < 30 ? 1960 : 1941;
          case 7:
            return f < 30 ? 1968 : 1938;
          case 8:
            return f < 30 ? 1957 : 1718;
          case 9:
            return 1832;
          case 10:
            return 1870;
          case 11:
            return 1814;
          case 12:
            return 1890;
        }
      return 1972;
    })(e, t, n) : _t;
    let [o, a, s] = Wr.call(this, {
      isoYear: r,
      isoMonth: Tt,
      isoDay: 31
    });
    const i = Vr.call(this, o), l = a === i;
    (Vt(e, Ha(a, i)) || Vt(Number(t), Number(l)) || Vt(n, s)) === 1 && o--;
    for (let u = 0; u < 100; u++) {
      const c = o - u, f = Vr.call(this, c), d = zr(e, t, f);
      if (t === (d === f) && n <= gi.call(this, c, d))
        return [c, d];
    }
  },
  sn(e) {
    const t = Tr.call(this, e);
    return t > Tr.call(this, e - 1) && t > Tr.call(this, e + 1);
  },
  L: Vr,
  B: Nr,
  cn(e, t) {
    const n = t + e, r = Math.sign(e), o = r < 0 ? -1 : 0;
    let a = 0;
    for (let s = t; s !== n; s += r)
      a += Nr.call(this, s + o);
    return a;
  },
  U: gi,
  fn: Tr,
  V(e, t, n) {
    return no(or.call(this, e, t, n));
  },
  p: or,
  un(e, t, n) {
    if (n) {
      if (t += n, !Number.isSafeInteger(t))
        throw new RangeError(Qt);
      if (n < 0)
        for (; t < 1; )
          t += Nr.call(this, --e);
      else {
        let r;
        for (; t > (r = Nr.call(this, e)); )
          t -= r, e++;
      }
    }
    return [e, t];
  },
  year(e) {
    return this.h(e).year;
  },
  month(e) {
    const { year: t, o: n } = this.h(e), { u: r } = this.l(t);
    return r[n] + 1;
  },
  day(e) {
    return this.h(e).day;
  }
}), Mo = /* @__PURE__ */ Gl(tm, am), W = /* @__PURE__ */ Gl(om, im), _i = {
  era: Fr,
  eraYear: je,
  year: je,
  month: Ys,
  monthCode(e) {
    const t = Fr(e);
    return Wa(t), t;
  },
  day: Ys,
  .../* @__PURE__ */ xn(Ot, je),
  .../* @__PURE__ */ xn(fe, ua),
  offset(e) {
    const t = Fr(e);
    return fn(t), t;
  }
}, bs = /* @__PURE__ */ se(Zi, Ot, rt), lm = /* @__PURE__ */ se(Zi, rt, Ot), Pt = "numeric", kr = ["timeZoneName"], Du = {
  month: Pt,
  day: Pt
}, _s = {
  year: Pt,
  month: Pt
}, ws = /* @__PURE__ */ Object.assign({}, _s, {
  day: Pt
}), ks = {
  hour: Pt,
  minute: Pt,
  second: Pt
}, $s = /* @__PURE__ */ Object.assign({}, ws, ks), um = /* @__PURE__ */ Object.assign({}, $s, {
  timeZoneName: "short"
}), cm = /* @__PURE__ */ Object.keys(_s), dm = /* @__PURE__ */ Object.keys(Du), fm = /* @__PURE__ */ Object.keys(ws), pm = /* @__PURE__ */ Object.keys(ks), Cs = ["dateStyle"], mm = /* @__PURE__ */ cm.concat(Cs), hm = /* @__PURE__ */ dm.concat(Cs), xs = /* @__PURE__ */ fm.concat(Cs, ["weekday"]), $r = /* @__PURE__ */ pm.concat(["dayPeriod", "timeStyle", "fractionalSecondDigits"]), Ms = /* @__PURE__ */ xs.concat($r), vm = /* @__PURE__ */ kr.concat($r), gm = /* @__PURE__ */ kr.concat(xs), ym = /* @__PURE__ */ kr.concat(["day", "weekday"], $r), bm = /* @__PURE__ */ kr.concat(["year", "weekday"], $r), _m = /* @__PURE__ */ pn(Ms, $s), wm = /* @__PURE__ */ pn(Ms, um), km = /* @__PURE__ */ pn(Ms, $s, kr), $m = /* @__PURE__ */ pn(xs, ws, vm), Cm = /* @__PURE__ */ pn($r, ks, gm), xm = /* @__PURE__ */ pn(mm, _s, ym), Mm = /* @__PURE__ */ pn(hm, Du, bm), Sm = {}, Tu = new At(void 0, {
  calendar: ie
}).resolvedOptions().calendar === ie, Nu = [_m, $a], Im = [wm, $a, 0, (e, t) => {
  const n = e.timeZone;
  if (t && t.timeZone !== n)
    throw new RangeError(uu);
  return n;
}], ju = [km, Fe], Ru = [$m, Fe], Fu = [Cm, (e) => Lt(e) / It], Vu = [xm, Fe, Tu], Au = [Mm, Fe, Tu];
let wi;
function Kt(e, t, n, r, o) {
  function a(...l) {
    if (!(this instanceof a))
      throw new TypeError(qo);
    Ci(this, t(...l));
  }
  function s(l, u) {
    return Object.defineProperties(function(...c) {
      return l.call(this, i(this), ...c);
    }, Kn(u));
  }
  function i(l) {
    const u = Pe(l);
    if (!u || u.branding !== e)
      throw new TypeError(qo);
    return u;
  }
  return Object.defineProperties(a.prototype, {
    ...ef(xt(s, n)),
    ...kn(xt(s, r)),
    ...ra("Temporal." + e)
  }), Object.defineProperties(a, {
    ...kn(o),
    ...Kn(e)
  }), [a, (l) => {
    const u = Object.create(a.prototype);
    return Ci(u, l), u;
  }, i];
}
function Pn(e) {
  if (Pe(e) || e.calendar !== void 0 || e.timeZone !== void 0)
    throw new TypeError(Lp);
  return e;
}
function Cr(e) {
  return Pu(e) || ie;
}
function Pu(e) {
  const { calendar: t } = e;
  if (t !== void 0)
    return So(t);
}
function So(e) {
  if (Ve(e)) {
    const { calendar: t } = Pe(e) || {};
    if (!t)
      throw new TypeError(su(e));
    return t;
  }
  return ((t) => _o(Tf(Te(t))))(e);
}
function Ss(e) {
  const t = {};
  for (const n in e)
    t[n] = (r) => {
      const { calendar: o } = r;
      return W(o)[n](r);
    };
  return t;
}
function en() {
  throw new TypeError(Up);
}
function qe(e) {
  if (Ve(e)) {
    const { timeZone: t } = Pe(e) || {};
    if (!t)
      throw new TypeError(lu(e));
    return t;
  }
  return ((t) => Ua(Nf(Te(t))))(e);
}
function Ce(e) {
  if (Ve(e)) {
    const t = Pe(e);
    return t && t.branding === ms ? t : tp(e);
  }
  return Df(e);
}
function zn(e) {
  if (e !== void 0) {
    if (Ve(e)) {
      const t = Pe(e) || {};
      switch (t.branding) {
        case Xt:
        case wr:
          return t;
        case An:
          return St(t);
      }
      const n = Cr(e);
      return {
        ...Hf(qe, K, W(n), e),
        calendar: n
      };
    }
    return xf(e);
  }
}
function Nt(e, t) {
  if (Ve(e)) {
    const r = Pe(e) || {};
    switch (r.branding) {
      case fs:
        return ce(t), r;
      case An:
        return ce(t), vt(r);
      case Xt:
        return ce(t), eu(K, r);
    }
    return ep(e, t);
  }
  const n = Ef(e);
  return ce(t), n;
}
function Is(e) {
  return e === void 0 ? void 0 : Nt(e);
}
function vn(e, t) {
  if (Ve(e)) {
    const r = Pe(e) || {};
    switch (r.branding) {
      case An:
        return ce(t), r;
      case wr:
        return ce(t), nt({
          ...r,
          ...Ye
        });
      case Xt:
        return ce(t), Xl(K, r);
    }
    return Jf(W(Cr(e)), e, t);
  }
  const n = Sf(e);
  return ce(t), n;
}
function ki(e, t) {
  if (Ve(e)) {
    const r = Pe(e);
    if (r && r.branding === ds)
      return ce(t), r;
    const o = Pu(e);
    return Kf(W(o || ie), !o, e, t);
  }
  const n = Of(W, e);
  return ce(t), n;
}
function gn(e, t) {
  if (Ve(e)) {
    const r = Pe(e);
    return r && r.branding === cs ? (ce(t), r) : Xf(W(Cr(e)), e, t);
  }
  const n = If(W, e);
  return ce(t), n;
}
function yn(e, t) {
  if (Ve(e)) {
    const r = Pe(e) || {};
    switch (r.branding) {
      case wr:
        return ce(t), r;
      case An:
        return ce(t), St(r);
      case Xt:
        return ce(t), Kl(K, r);
    }
    return Qf(W(Cr(e)), e, t);
  }
  const n = Ra(e);
  return ce(t), n;
}
function bn(e, t) {
  if (Ve(e)) {
    const n = Pe(e);
    if (n && n.branding === Xt)
      return oo(t), n;
    const r = Cr(e);
    return Gf(qe, K, W(r), r, e, t);
  }
  return Mf(e, t);
}
function $i(e) {
  return xt((t) => (n) => t(Jo(n)), e);
}
function Jo(e) {
  return Ge(e, K);
}
function _n(e) {
  if (Ve(e)) {
    const t = Pe(e);
    if (t)
      switch (t.branding) {
        case ps:
          return t;
        case Xt:
          return Mt(t.epochNanoseconds);
      }
  }
  return Cf(e);
}
function Om() {
  function e(a, s) {
    return new t(a, s);
  }
  function t(a, s = /* @__PURE__ */ Object.create(null)) {
    Jr.set(this, ((i, l) => {
      const u = new At(i, l), c = u.resolvedOptions(), f = c.locale, d = et(Object.keys(l), c), h = ze(Tm), v = (w, ...y) => {
        if (w) {
          if (y.length !== 2)
            throw new TypeError(Vo);
          for (const O of y)
            if (O === void 0)
              throw new TypeError(Vo);
        }
        w || y[0] !== void 0 || (y = []);
        const _ = y.map((O) => Pe(O) || Number(O));
        let C, $ = 0;
        for (const O of _) {
          const N = typeof O == "object" ? O.branding : void 0;
          if ($++ && N !== C)
            throw new TypeError(Vo);
          C = N;
        }
        return C ? h(C)(f, d, ..._) : [u, ..._];
      };
      return v.X = u, v;
    })(a, s));
  }
  const n = At.prototype, r = Object.getOwnPropertyDescriptors(n), o = Object.getOwnPropertyDescriptors(At);
  for (const a in r) {
    const s = r[a], i = a.startsWith("format") && Em(a);
    typeof s.value == "function" ? s.value = a === "constructor" ? e : i || Dm(a) : i && (s.get = function() {
      if (!Jr.has(this))
        throw new TypeError(qo);
      return (...l) => i.apply(this, l);
    }, Object.defineProperties(s.get, Kn(`get ${a}`)));
  }
  return o.prototype.value = t.prototype = Object.create({}, r), Object.defineProperties(e, o), e;
}
function Em(e) {
  return Object.defineProperties(function(...t) {
    const n = Jr.get(this), [r, ...o] = n(e.includes("Range"), ...t);
    return r[e](...o);
  }, Kn(e));
}
function Dm(e) {
  return Object.defineProperties(function(...t) {
    return Jr.get(this).X[e](...t);
  }, Kn(e));
}
function Tm(e) {
  const t = Am[e];
  if (!t)
    throw new TypeError(s1(e));
  return Gt(t, ze(tu), 1);
}
const Gr = /* @__PURE__ */ new WeakMap(), Pe = /* @__PURE__ */ Gr.get.bind(Gr), Ci = /* @__PURE__ */ Gr.set.bind(Gr), Bu = {
  era: tf,
  eraYear: Wi,
  year: aa,
  month: gt,
  daysInMonth: gt,
  daysInYear: gt,
  inLeapYear: f1,
  monthsInYear: gt
}, Os = {
  monthCode: Te
}, Lu = {
  day: gt
}, Nm = {
  dayOfWeek: gt,
  dayOfYear: gt,
  weekOfYear: nf,
  yearOfWeek: Wi,
  daysInWeek: gt
}, Es = /* @__PURE__ */ Ss(/* @__PURE__ */ Object.assign({}, Bu, Os, Lu, Nm)), jm = /* @__PURE__ */ Ss({
  ...Bu,
  ...Os
}), Rm = /* @__PURE__ */ Ss({
  ...Os,
  ...Lu
}), xr = {
  calendarId: (e) => e.calendar
}, Fm = /* @__PURE__ */ Xr((e) => (t) => t[e], fe.concat("sign")), Ds = /* @__PURE__ */ Xr((e, t) => (n) => n[rt[t]], Ot), Uu = {
  epochMilliseconds: $a,
  epochNanoseconds: af
}, [Vm, ye, fb] = Kt(ms, vp, {
  ...Fm,
  blank: kf
}, {
  with: (e, t) => ye(lp(e, t)),
  negated: (e) => ye(ja(e)),
  abs: (e) => ye(wf(e)),
  add: (e, t, n) => ye(li(zn, W, K, 0, e, Ce(t), n)),
  subtract: (e, t, n) => ye(li(zn, W, K, 1, e, Ce(t), n)),
  round: (e, t) => ye(_f(zn, W, K, e, t)),
  total: (e, t) => sf(zn, W, K, e, t),
  toLocaleString(e, t, n) {
    return Intl.DurationFormat ? new Intl.DurationFormat(t, n).format(this) : To(e);
  },
  toString: To,
  toJSON: (e) => To(e),
  valueOf: en
}, {
  from: (e) => ye(Ce(e)),
  compare: (e, t, n) => Rf(zn, W, K, Ce(e), Ce(t), n)
}), Am = {
  Instant: Nu,
  PlainDateTime: ju,
  PlainDate: Ru,
  PlainTime: Fu,
  PlainYearMonth: Vu,
  PlainMonthDay: Au
}, Pm = /* @__PURE__ */ Gt(Nu), Bm = /* @__PURE__ */ Gt(Im), Lm = /* @__PURE__ */ Gt(ju), Um = /* @__PURE__ */ Gt(Ru), Zm = /* @__PURE__ */ Gt(Fu), Ym = /* @__PURE__ */ Gt(Vu), qm = /* @__PURE__ */ Gt(Au), [zm, Rt] = Kt(fs, hp, Ds, {
  with(e, t, n) {
    return Rt(ip(this, Pn(t), n));
  },
  add: (e, t) => Rt(ii(0, e, Ce(t))),
  subtract: (e, t) => Rt(ii(1, e, Ce(t))),
  until: (e, t, n) => ye(vi(0, e, Nt(t), n)),
  since: (e, t, n) => ye(vi(1, e, Nt(t), n)),
  round: (e, t) => Rt(df(e, t)),
  equals: (e, t) => Uf(e, Nt(t)),
  toLocaleString(e, t, n) {
    const [r, o] = Zm(t, n, e);
    return r.format(o);
  },
  toString: ei,
  toJSON: (e) => ei(e),
  valueOf: en
}, {
  from: (e, t) => Rt(Nt(e, t)),
  compare: (e, t) => Ya(Nt(e), Nt(t))
}), [Wm, at] = Kt(An, se(dp, hr), {
  ...xr,
  ...Es,
  ...Ds
}, {
  with: (e, t, n) => at(rp(W, e, Pn(t), n)),
  withCalendar: (e, t) => at(Ga(e, So(t))),
  withPlainTime: (e, t) => at(Ep(e, Is(t))),
  add: (e, t, n) => at(oi(W, 0, e, Ce(t), n)),
  subtract: (e, t, n) => at(oi(W, 1, e, Ce(t), n)),
  until: (e, t, n) => ye(pi(W, 0, e, vn(t), n)),
  since: (e, t, n) => ye(pi(W, 1, e, vn(t), n)),
  round: (e, t) => at(cf(e, t)),
  equals: (e, t) => Af(e, vn(t)),
  toZonedDateTime: (e, t, n) => Ne(bp(K, e, qe(t), n)),
  toPlainDate: (e) => st(St(e)),
  toPlainTime: (e) => Rt(vt(e)),
  toLocaleString(e, t, n) {
    const [r, o] = Lm(t, n, e);
    return r.format(o);
  },
  toString: Js,
  toJSON: (e) => Js(e),
  valueOf: en
}, {
  from: (e, t) => at(vn(e, t)),
  compare: (e, t) => Nl(vn(e), vn(t))
}), [Hm, Qo, pb] = Kt(ds, se(mp, hr), {
  ...xr,
  ...Rm
}, {
  with: (e, t, n) => Qo(sp(W, e, Pn(t), n)),
  equals: (e, t) => Lf(e, ki(t)),
  toPlainDate(e, t) {
    return st(xp(W, e, this, t));
  },
  toLocaleString(e, t, n) {
    const [r, o] = qm(t, n, e);
    return r.format(o);
  },
  toString: Ks,
  toJSON: (e) => Ks(e),
  valueOf: en
}, {
  from: (e, t) => Qo(ki(e, t))
}), [Gm, Hn, mb] = Kt(cs, se(pp, hr), {
  ...xr,
  ...jm
}, {
  with: (e, t, n) => Hn(ap(W, e, Pn(t), n)),
  add: (e, t, n) => Hn(si(W, 0, e, Ce(t), n)),
  subtract: (e, t, n) => Hn(si(W, 1, e, Ce(t), n)),
  until: (e, t, n) => ye(hi(W, 0, e, gn(t), n)),
  since: (e, t, n) => ye(hi(W, 1, e, gn(t), n)),
  equals: (e, t) => Bf(e, gn(t)),
  toPlainDate(e, t) {
    return st(Cp(W, e, this, t));
  },
  toLocaleString(e, t, n) {
    const [r, o] = Ym(t, n, e);
    return r.format(o);
  },
  toString: Xs,
  toJSON: (e) => Xs(e),
  valueOf: en
}, {
  from: (e, t) => Hn(gn(e, t)),
  compare: (e, t) => Rn(gn(e), gn(t))
}), [Jm, st, hb] = Kt(wr, se(fp, hr), {
  ...xr,
  ...Es
}, {
  with: (e, t, n) => st(op(W, e, Pn(t), n)),
  withCalendar: (e, t) => st(Ga(e, So(t))),
  add: (e, t, n) => st(ai(W, 0, e, Ce(t), n)),
  subtract: (e, t, n) => st(ai(W, 1, e, Ce(t), n)),
  until: (e, t, n) => ye(mi(W, 0, e, yn(t), n)),
  since: (e, t, n) => ye(mi(W, 1, e, yn(t), n)),
  equals: (e, t) => Pf(e, yn(t)),
  toZonedDateTime(e, t) {
    const n = Ve(t) ? t : {
      timeZone: t
    };
    return Ne(_p(qe, Nt, K, e, n));
  },
  toPlainDateTime: (e, t) => at(wp(e, Is(t))),
  toPlainYearMonth(e) {
    return Hn(kp(W, e, this));
  },
  toPlainMonthDay(e) {
    return Qo($p(W, e, this));
  },
  toLocaleString(e, t, n) {
    const [r, o] = Um(t, n, e);
    return r.format(o);
  },
  toString: Qs,
  toJSON: (e) => Qs(e),
  valueOf: en
}, {
  from: (e, t) => st(yn(e, t)),
  compare: (e, t) => Rn(yn(e), yn(t))
}), [Qm, Ne] = Kt(Xt, se(cp, hr, jf), {
  ...Uu,
  ...xr,
  ...$i(Es),
  ...$i(Ds),
  offset: (e) => fr(Jo(e).offsetNanoseconds),
  offsetNanoseconds: (e) => Jo(e).offsetNanoseconds,
  timeZoneId: (e) => e.timeZone,
  hoursInDay: (e) => ff(K, e)
}, {
  with: (e, t, n) => Ne(np(W, K, e, Pn(t), n)),
  withCalendar: (e, t) => Ne(Ga(e, So(t))),
  withTimeZone: (e, t) => Ne(Dp(e, qe(t))),
  withPlainTime: (e, t) => Ne(Op(K, e, Is(t))),
  add: (e, t, n) => Ne(ri(W, K, 0, e, Ce(t), n)),
  subtract: (e, t, n) => Ne(ri(W, K, 1, e, Ce(t), n)),
  until: (e, t, n) => ye(xe(fi(W, K, 0, e, bn(t), n))),
  since: (e, t, n) => ye(xe(fi(W, K, 1, e, bn(t), n))),
  round: (e, t) => Ne(uf(K, e, t)),
  startOfDay: (e) => Ne(pf(K, e)),
  equals: (e, t) => Vf(e, bn(t)),
  toInstant: (e) => jt(yp(e)),
  toPlainDateTime: (e) => at(Xl(K, e)),
  toPlainDate: (e) => st(Kl(K, e)),
  toPlainTime: (e) => Rt(eu(K, e)),
  toLocaleString(e, t, n = {}) {
    const [r, o] = Bm(t, n, e);
    return r.format(o);
  },
  toString: (e, t) => Gs(K, e, t),
  toJSON: (e) => Gs(K, e),
  valueOf: en,
  getTimeZoneTransition(e, t) {
    const { timeZone: n, epochNanoseconds: r } = e, o = of(t), a = K(n).O(r, o);
    return a ? Ne({
      ...e,
      epochNanoseconds: a
    }) : null;
  }
}, {
  from: (e, t) => Ne(bn(e, t)),
  compare: (e, t) => Tl(bn(e), bn(t))
}), [Xm, jt, vb] = Kt(ps, up, Uu, {
  add: (e, t) => jt(ni(0, e, Ce(t))),
  subtract: (e, t) => jt(ni(1, e, Ce(t))),
  until: (e, t, n) => ye(di(0, e, _n(t), n)),
  since: (e, t, n) => ye(di(1, e, _n(t), n)),
  round: (e, t) => jt(lf(e, t)),
  equals: (e, t) => Ff(e, _n(t)),
  toZonedDateTimeISO: (e, t) => Ne(gp(e, qe(t))),
  toLocaleString(e, t, n) {
    const [r, o] = Pm(t, n, e);
    return r.format(o);
  },
  toString: (e, t) => Hs(qe, K, e, t),
  toJSON: (e) => Hs(qe, K, e),
  valueOf: en
}, {
  from: (e) => jt(_n(e)),
  fromEpochMilliseconds: (e) => jt(Mp(e)),
  fromEpochNanoseconds: (e) => jt(Sp(e)),
  compare: (e, t) => Dl(_n(e), _n(t))
}), Km = /* @__PURE__ */ Object.defineProperties({}, {
  ...ra("Temporal.Now"),
  ...kn({
    timeZoneId: () => Yn(),
    instant: () => jt(Mt(Yo())),
    zonedDateTimeISO: (e = Yn()) => Ne(tt(Yo(), qe(e), ie)),
    plainDateTimeISO: (e = Yn()) => at(nt(Fo(K(qe(e))), ie)),
    plainDateISO: (e = Yn()) => st(St(Fo(K(qe(e))), ie)),
    plainTimeISO: (e = Yn()) => Rt(vt(Fo(K(qe(e)))))
  })
}), Xo = /* @__PURE__ */ Object.defineProperties({}, {
  ...ra("Temporal"),
  ...kn({
    PlainYearMonth: Gm,
    PlainMonthDay: Hm,
    PlainDate: Jm,
    PlainTime: zm,
    PlainDateTime: Wm,
    ZonedDateTime: Qm,
    Instant: Xm,
    Duration: Vm,
    Now: Km
  })
}), e0 = /* @__PURE__ */ Om(), Jr = /* @__PURE__ */ new WeakMap();
Object.create(Intl), kn({
  DateTimeFormat: e0
});
const t0 = { "data-test": "display-date" }, n0 = {
  __name: "display-date",
  props: {
    /**
     * The date to convert and display.
     */
    date: {
      type: String,
      default: null
    },
    /**
     * The locale to use when formatting dates. By default, the user's locale is
     * used.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The formatting options to apply to the displayed date, as defined by
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
     */
    format: {
      type: Object,
      default: () => ({})
    }
  },
  setup(e) {
    const t = e, n = k(() => F(t.date) ? t.date.includes("[") ? "ZonedDateTime" : t.date.includes("T") ? "PlainDateTime" : "PlainDate" : null), r = k(() => {
      if (!F(t.date))
        return null;
      try {
        const o = Xo[n.value].from(t.date);
        return !F(t.locale) && !oe(t.format) ? o.toLocaleString() : o.toLocaleString(t.locale, t.format);
      } catch (o) {
        return console.error("date-display[displayDate]", o), null;
      }
    });
    return (o, a) => (m(), S("span", t0, ne(r.value), 1));
  }
}, Zu = [
  "text-pink-900 dark:text-pink-500",
  "text-pink-700 dark:text-pink-400",
  "text-pink-500 dark:text-pink-300",
  "text-pink-300 dark:text-pink-200",
  "text-pink-100"
], r0 = [
  "text-[#12436D] dark:text-[#2278C3]",
  "text-[#28A197] dark:text-[#27A197]",
  "text-[#801650] dark:text-[#D92687]",
  "text-[#F46A25] dark:text-[#F68B55]",
  "text-[#3D3D3D] dark:text-[#707070]",
  "text-[#A285D1] dark:text-[#DACFED]"
];
function o0(e, t) {
  const n = L(t) ? t : Zu;
  return n[Uo(e - 1, n, { wrap: !0 })];
}
const a0 = ["viewBox"], Bo = 100, xi = 20, s0 = {
  __name: "donut-chart",
  props: {
    /**
     * The values to represent in this donut chart. Appropriate proportions will
     * be determined automatically based on the sum of these values.
     *
     * If any non-numbers, or negative numbers, appear in the list, a chart will
     * not be created.
     */
    values: {
      type: Array,
      required: !0
    },
    /**
     * Whether to use the brighter set of chart colours. Use with caution, as
     * depending on the number of slices, adjacent slices may not be
     * sufficiently distinct.
     */
    colourful: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = e, n = Bo / 2, r = n, o = r - xi, a = k(() => L(i.value)), s = k(() => !L(t.values) || !t.values.every((f) => pe(f) && f >= 0) ? 0 : t.values.reduce((f, d) => f + d, 0)), i = k(() => {
      if (s.value === 0)
        return [];
      let f = 0;
      return t.values.map((d) => {
        const h = {
          commands: u(d),
          rotation: f * 3.6,
          id: ln()
        };
        return f += d / s.value * 100, h;
      });
    }), l = k(() => t.colourful ? r0 : Zu);
    function u(f) {
      const d = f / s.value * 360, h = d > 180 ? 1 : 0, v = [];
      return v.push(`M ${r} 0`), v.push(
        `A ${r} ${r} 0 ${h} 1 ${c(d, r)}`
      ), v.push(
        `L ${c(d, o)}`
      ), v.push(
        `A ${o} ${o} 0 ${h} 0 ${n} ${xi}`
      ), v.join(" ");
    }
    function c(f, d) {
      if (!pe(f) || !pe(d))
        return "0 0";
      const h = d * Math.sin(f * Math.PI / 180) + 50, v = -d * Math.cos(f * Math.PI / 180) + 50;
      return `${h} ${v}`;
    }
    return (f, d) => a.value ? (m(), S("svg", {
      key: 0,
      viewBox: `0 0 ${Bo} ${Bo}`,
      "data-test": "donut-chart"
    }, [
      (m(!0), S(de, null, we(i.value, (h, v) => (m(), S("path", I({
        key: h.id,
        class: ["animate-fade-in delay origin-center fill-current", q(o0)(v, l.value)]
      }, { ref_for: !0 }, {
        d: h.commands,
        transform: `rotate(${h.rotation})`
      }, { "data-test": "donut-chart-segment" }), null, 16))), 128))
    ], 8, a0)) : E("", !0);
  }
}, i0 = "button--muted", l0 = "animate-fade-in-down animate-fast mt-2 min-w-3xs rounded-lg border border-grey-200 bg-white py-2 shadow-sm dark:border-white/20 dark:bg-grey-800", u0 = {
  __name: "dropdown-menu",
  emits: ["open", "close"],
  setup(e, { expose: t, emit: n }) {
    const r = n, o = U(null);
    function a() {
      ae(o.value, "openDetails");
    }
    function s() {
      ae(o.value, "closeDetails");
    }
    return t({
      openMenu: a,
      closeMenu: s
    }), (i, l) => {
      const u = M("summary-details");
      return m(), x(u, I({
        ref_key: "summaryDetailsComponent",
        ref: o
      }, { floating: !0, closeWithClickOutside: !0, summaryClasses: i0, detailsClasses: l0 }, {
        onOpen: l[0] || (l[0] = (c) => r("open")),
        onClose: l[1] || (l[1] = (c) => r("close"))
      }), {
        summary: g(({ open: c, icon: f }) => [
          b(i.$slots, "summary", H(ee({ open: c, icon: f })))
        ]),
        default: g(({ open: c, icon: f }) => [
          b(i.$slots, "default", H(ee({ open: c, icon: f })))
        ]),
        _: 3
      }, 16);
    };
  }
}, c0 = {
  __name: "dropdown-menu-button",
  props: {
    /**
     * An icon to show with this button, which will appear at its start.
     */
    icon: {
      type: String,
      default: null
    },
    /**
     * Whether this menu button should show a selected state.
     */
    selected: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("ui-button");
      return m(), x(r, I({
        class: ["w-full border-s-2 px-4 py-2 hocus:border-current hocus:bg-grey-50 hocus:text-purple-800 dark:hocus:bg-white/10 dark:hocus:text-purple-300", {
          "border-current bg-grey-50 text-purple-800 dark:bg-white/10 dark:text-purple-300": e.selected,
          "border-transparent": !e.selected
        }]
      }, { iconStart: e.icon }), {
        default: g(() => [
          b(t.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
}, d0 = {
  __name: "dropdown-menu-checkbox",
  props: {
    modelValue: {
      type: Boolean
    },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const t = Me(e, "modelValue");
    return (n, r) => {
      const o = M("form-checkbox");
      return m(), x(o, {
        modelValue: t.value,
        "onUpdate:modelValue": r[0] || (r[0] = (a) => t.value = a),
        class: "px-4 py-1",
        "data-test": "dropdown-menu-checkbox"
      }, {
        default: g(() => [
          b(n.$slots, "default")
        ]),
        _: 3
      }, 8, ["modelValue"]);
    };
  }
}, B = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, o] of t)
    n[r] = o;
  return n;
}, f0 = {}, p0 = { class: "my-2 border-b border-grey-200 dark:border-white/20" };
function m0(e, t) {
  return m(), S("div", p0);
}
const h0 = /* @__PURE__ */ B(f0, [["render", m0]]), v0 = {
  __name: "dropdown-menu-link",
  props: {
    /**
     * Whether this menu button should show a selected state.
     */
    selected: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("link-tag");
      return m(), x(r, {
        class: te(["w-full border-s-2 px-4 py-2 hocus:border-current hocus:bg-grey-50 dark:hocus:bg-white/10", {
          "border-current bg-grey-50 dark:bg-white/10": e.selected,
          "border-transparent": !e.selected
        }])
      }, {
        default: g(() => [
          b(t.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
}, g0 = {
  __name: "dropdown-menu-title",
  props: {
    /**
     * The heading level to use for the dropdown menu title.
     */
    headingLevel: {
      type: String,
      default: "h4"
    }
  },
  setup(e) {
    return (t, n) => (m(), x(he(e.headingLevel), { class: "my-2 px-4 font-semibold text-grey-950" }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }));
  }
}, y0 = {
  __name: "floating-details",
  props: {
    /**
     * Whether to align to the dropdown to the start or end of the summary. This
     * is useful for menus that open to the end of the screen, for example.
     * Anything but "start" will be treated as "end".
     */
    align: {
      type: String,
      default: "start"
    },
    /**
     * Any classes to add to the summary element, allowing styling to wrap both
     * the summary and icons.
     */
    summaryClasses: {
      type: [String, Array, Object],
      default: "button--muted"
    },
    /**
     * Any classes to add to the details content.
     */
    detailsClasses: {
      type: [String, Array, Object],
      default: "mt-3 rounded-md border p-4 shadow"
    },
    /**
     * Any colours to apply to the details. These are passed as additional
     * classes, but are separate so that colours can be redefined without
     * affecting remaining styling.
     */
    detailsColourClasses: {
      type: [String, Array, Object],
      default: "border-grey-200 bg-white dark:border-transparent dark:bg-grey-950/20 backdrop-blur-lg"
    },
    /**
     * Any classes to add to specify the details content's size. This is
     * separate to details classes so that the appearance can be consistent even
     * if the size is not.
     */
    detailsSizeClasses: {
      type: [String, Array, Object],
      default: "max-w-lg"
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("summary-details");
      return m(), x(r, I({ floating: !0, closeWithClickOutside: !0, align: "end", summaryClasses: e.summaryClasses, detailsClasses: ["w-screen", e.detailsClasses, e.detailsColourClasses, e.detailsSizeClasses] }, { "data-test": "floating-menu" }), {
        summary: g(() => [
          b(t.$slots, "summary")
        ]),
        default: g(() => [
          b(t.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
}, b0 = {
  class: "flex flex-wrap items-center gap-4",
  "data-test": "form-actions"
}, _0 = {
  key: 0,
  class: "w-full"
}, w0 = {
  __name: "form-actions",
  setup(e) {
    const t = ke(), n = k(() => ue(t["tertiary-actions"]));
    return (r, o) => (m(), S("div", b0, [
      b(r.$slots, "default"),
      n.value ? (m(), S("div", _0, [
        b(r.$slots, "tertiary-actions")
      ])) : E("", !0)
    ]));
  }
};
function Bn(e) {
  const t = k(() => `${e}-error`), n = k(() => `${e}-help`), r = U("");
  function o({ haveHelp: a, haveError: s } = {}) {
    if (!a && !s) {
      r.value = null;
      return;
    }
    const i = [];
    a && i.push(n.value), s && i.push(t.value), r.value = i.join(" ");
  }
  return {
    errorId: t,
    helpId: n,
    describedBy: r,
    updateDescribedBy: o
  };
}
function hn(e) {
  return {
    inputId: k(() => F(e) ? e : ln())
  };
}
const k0 = {}, $0 = {
  class: "text-red-600 dark:text-red-300",
  "data-test": "form-error"
};
function C0(e, t) {
  return m(), S("div", $0, [
    b(e.$slots, "default")
  ]);
}
const x0 = /* @__PURE__ */ B(k0, [["render", C0]]), M0 = {}, S0 = {
  class: "text-grey-500 dark:text-white/60",
  "data-test": "form-help"
};
function I0(e, t) {
  return m(), S("span", S0, [
    b(e.$slots, "default")
  ]);
}
const O0 = /* @__PURE__ */ B(M0, [["render", I0]]), E0 = {
  key: 0,
  class: "flex flex-col text-sm"
}, Ln = {
  __name: "form-supplementary",
  props: {
    /**
     * The ID of the input to which this supplementary information belongs.
     */
    inputId: {
      type: String,
      required: !0
    }
  },
  emits: ["update:describedby"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = ke(), { errorId: a, helpId: s } = Bn(n.inputId), i = k(() => ue(o.help)), l = k(() => ue(o.error));
    return _e([i, l], () => {
      r("update:describedby", { haveHelp: i.value, haveError: l.value });
    }, { immediate: !0 }), (u, c) => i.value || l.value ? (m(), S("div", E0, [
      l.value ? (m(), x(x0, H(I({ key: 0 }, { id: q(a) })), {
        default: g(() => [
          b(u.$slots, "error")
        ]),
        _: 3
      }, 16)) : E("", !0),
      i.value ? (m(), x(O0, H(I({ key: 1 }, { id: q(s) })), {
        default: g(() => [
          b(u.$slots, "help")
        ]),
        _: 3
      }, 16)) : E("", !0)
    ])) : E("", !0);
  }
}, D0 = {
  class: "flex flex-col gap-1",
  "data-test": "form-checkbox"
}, T0 = {
  __name: "form-checkbox",
  props: /* @__PURE__ */ Re({
    /**
     * Any ID to apply to this field. If an ID is not provided, one will be
     * generated at random. Note that when providing an ID, please make sure
     * that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Whether to display the label. A label is still required for accessibility
     * purposes.
     */
    displayLabel: {
      type: Boolean,
      default: !0
    },
    /**
     * Any placeholder to show in the input. Do not use a placeholder for
     * critical information. Always use the label and help text as priorities.
     */
    placeholder: {
      type: String,
      default: null
    },
    /**
     * Any additional attributes to pass to the input itself, such as aria
     * attributes.
     */
    inputAttributes: {
      type: Object,
      default: null
    }
  }, {
    modelValue: {
      type: [Boolean, Array]
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = ke(), o = Me(e, "modelValue"), a = Ke("inputElement"), { inputId: s } = hn(n.id), { updateDescribedBy: i, describedBy: l } = Bn(s.value), u = k(() => ue(r.error));
    function c() {
      ae(a.value, "focus");
    }
    return t({
      triggerFocus: c
    }), (f, d) => (m(), S("div", D0, [
      p("div", {
        class: te(["flex gap-3", { "justify-center": !e.displayLabel }])
      }, [
        me(p("input", I({
          ref_key: "inputElement",
          ref: a,
          "onUpdate:modelValue": d[0] || (d[0] = (h) => o.value = h),
          class: ["form-checkbox mt-1", { "form-field--error": u.value }]
        }, {
          id: q(s),
          "aria-describedby": q(l),
          ...e.inputAttributes,
          type: "checkbox"
        }), null, 16), [
          [Ei, o.value]
        ]),
        P(kt, I({
          class: { "sr-only": !e.displayLabel }
        }, { id: q(s), styled: !1 }), {
          default: g(() => [
            b(f.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ], 2),
      P(Ln, I({ inputId: q(s) }, { "onUpdate:describedby": q(i) }), {
        error: g(() => [
          b(f.$slots, "error")
        ]),
        help: g(() => [
          b(f.$slots, "help")
        ]),
        _: 3
      }, 16, ["onUpdate:describedby"])
    ]));
  }
}, N0 = {
  __name: "form-checkbox-group",
  props: {
    /**
     * Our provided model value for our input. We convert this internally into
     * something that can be provided to our input group.
     */
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const r = e, o = n, a = Ke("input-group"), s = U({});
    _e(s, () => {
      if (!oe(s.value))
        return;
      const l = rn(s.value).filter((u) => s.value[u]);
      (wt(l) !== wt(r.modelValue) || l.some((u, c) => u !== r.modelValue[c])) && o("update:modelValue", l);
    }, { deep: !0 }), _e(() => r.modelValue, () => {
      L(r.modelValue) || (s.value = {});
      const u = r.modelValue.filter((c) => F(c)).reduce((c, f) => (c[f] = !0, c), {});
      s.value = u;
    });
    function i() {
      ae(a.value, "triggerFocus");
    }
    return t({
      triggerFocus: i
    }), (l, u) => {
      const c = M("form-input-group");
      return m(), x(c, I({
        ref: "input-group",
        modelValue: s.value,
        "onUpdate:modelValue": u[0] || (u[0] = (f) => s.value = f)
      }, { type: "checkbox" }, { "data-test": "form-checkbox-group" }), {
        introduction: g(() => [
          b(l.$slots, "introduction")
        ]),
        help: g(() => [
          b(l.$slots, "help")
        ]),
        error: g(() => [
          b(l.$slots, "error")
        ]),
        default: g(() => [
          b(l.$slots, "default")
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
}, j0 = {
  key: 0,
  class: "absolute inset-y-0 start-0 w-1 rounded-full bg-red-600 dark:bg-red-300"
}, Mr = {
  __name: "field-wrapper",
  props: {
    /**
     * The tag to use for the wrapper, most useful when a fieldset is required,
     * such as a date field.
     */
    tag: {
      type: String,
      default: "div"
    },
    /**
     * Whether this field has an error, allowing us to style the wrapper
     * appropriately.
     */
    haveError: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    return (t, n) => (m(), x(he(e.tag), {
      class: te(["flex flex-col gap-1", { "relative ps-5": e.haveError }]),
      "data-test": "field-wrapper"
    }, {
      default: g(() => [
        e.haveError ? (m(), S("div", j0)) : E("", !0),
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}, R0 = { class: "flex gap-8 mt-1" }, F0 = {
  __name: "form-date",
  props: /* @__PURE__ */ Re({
    /**
     * Any ID to apply to this field. If an ID is not provided, one will be
     * generated at random. Note that when providing an ID, please make sure
     * that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Whether this field is required.
     */
    required: {
      type: Boolean,
      default: !1
    }
  }, {
    modelValue: {
      type: [Object, String]
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = Me(e, "modelValue"), o = ke(), a = Ke("dayInput"), { inputId: s } = hn(n.id), i = k(() => ue(o.introduction));
    u();
    const l = k(() => oe(r.value) ? ["day", "month", "year"].every((v) => {
      const w = r.value[v], y = typeof w == "string", _ = pe(w), C = w > 0;
      return y || _ && C;
    }) : !1);
    function u() {
      if (F(r.value) && d(r.value), !oe(r.value)) {
        r.value = { day: "", month: "", year: "" };
        return;
      }
      r.value.day = c("day"), r.value.month = c("month"), r.value.year = c("year");
    }
    function c(v) {
      const w = Q(r.value, v), y = F(w) && Wn(w), _ = pe(w) && w > 0;
      return !y && !_ ? "" : w.toString();
    }
    function f() {
      if (!l.value)
        return "";
      try {
        return Xo.PlainDate.from(r.value).toString();
      } catch (v) {
        return console.error("form-date[toString]", v), "";
      }
    }
    function d(v) {
      if (F(v))
        try {
          const { day: w, month: y, year: _ } = Xo.PlainDate.from(v);
          r.value = { day: w.toString(), month: y.toString(), year: _.toString() };
        } catch (w) {
          console.error("form-date[setDateFromString]", w);
        }
    }
    function h() {
      ae(a, "triggerFocus");
    }
    return t({
      toString: f,
      setDateFromIsoString: d,
      triggerFocus: h
    }), (v, w) => {
      const y = M("conditional-wrapper"), _ = M("form-input");
      return m(), x(Mr, I({ tag: "fieldset", haveError: v.haveError }, { "data-test": "form-date" }), {
        default: g(() => [
          P(kt, { tag: "legend" }, {
            default: g(() => [
              b(v.$slots, "default")
            ]),
            _: 3
          }),
          P(y, H(ee({ wrap: i.value, tag: "p" })), {
            default: g(() => [
              b(v.$slots, "introduction")
            ]),
            _: 3
          }, 16),
          p("div", R0, [
            l.value ? (m(), x(_, I({
              key: 0,
              ref_key: "dayInput",
              ref: a,
              modelValue: r.value.day,
              "onUpdate:modelValue": w[0] || (w[0] = (C) => r.value.day = C)
            }, {
              required: e.required,
              id: `${q(s)}-day`,
              placeholder: v.dayPlaceholder
            }, {
              class: "w-20",
              "data-test": "form-date-day"
            }), {
              default: g(() => [
                b(v.$slots, "day-label", {}, () => [
                  w[3] || (w[3] = V(" Day "))
                ])
              ]),
              _: 3
            }, 16, ["modelValue"])) : E("", !0),
            l.value ? (m(), x(_, I({
              key: 1,
              modelValue: r.value.month,
              "onUpdate:modelValue": w[1] || (w[1] = (C) => r.value.month = C)
            }, {
              required: e.required,
              id: `${q(s)}-month`,
              placeholder: v.monthPlaceholder
            }, {
              class: "w-20",
              "data-test": "form-date-month"
            }), {
              default: g(() => [
                b(v.$slots, "month-label", {}, () => [
                  w[4] || (w[4] = V(" Month "))
                ])
              ]),
              _: 3
            }, 16, ["modelValue"])) : E("", !0),
            l.value ? (m(), x(_, I({
              key: 2,
              modelValue: r.value.year,
              "onUpdate:modelValue": w[2] || (w[2] = (C) => r.value.year = C)
            }, {
              required: e.required,
              id: `${q(s)}-year`,
              placeholder: v.yearPlaceholder
            }, {
              class: "w-40",
              "data-test": "form-date-year"
            }), {
              default: g(() => [
                b(v.$slots, "year-label", {}, () => [
                  w[5] || (w[5] = V(" Year "))
                ])
              ]),
              _: 3
            }, 16, ["modelValue"])) : E("", !0)
          ]),
          P(Ln, H(ee({ inputId: q(s) })), {
            error: g(() => [
              b(v.$slots, "error")
            ]),
            help: g(() => [
              b(v.$slots, "help")
            ]),
            _: 3
          }, 16)
        ]),
        _: 3
      }, 16);
    };
  }
};
function V0(e, t, n) {
  if (!F(e) || !L(t) || !oe(n))
    return !0;
  const r = [];
  for (const o of t)
    A0(e, o, n) || r.push(o.message);
  return r;
}
function A0(e, t, n) {
  let r = n == null ? void 0 : n[e];
  if (r === void 0)
    return !1;
  switch (t.rule) {
    case "required":
      return ![void 0, "", !1, null].includes(r);
    case "email":
      return r.includes("@");
    case "size":
      return pe(t.size) ? (Wn(r) && (r = parseInt(r)), Ir(r) === t.size) : !1;
    case "min":
      return pe(t.min) ? (Wn(r) && (r = parseInt(r)), Ir(r) >= t.min) : !1;
    case "max":
      return pe(t.max) ? (Wn(r) && (r = parseInt(r)), Ir(r) <= t.max) : !1;
    case "between": {
      if (!pe(t.min) || !pe(t.max))
        return !1;
      Wn(r) && (r = parseInt(r));
      const o = Ir(r);
      return o >= t.min && o <= t.max;
    }
    case "in":
      return L(t.options) ? t.options.includes(r) : !1;
    case "not_in":
      return L(t.options) ? !t.options.includes(r) : !1;
    case "regexp":
      return !F(r) || !(t.regexp instanceof RegExp) ? !1 : t.regexp.test(r);
  }
  return !0;
}
const P0 = { key: 0 }, B0 = "text", L0 = "form-input", U0 = {
  __name: "form-field",
  props: /* @__PURE__ */ Re({
    /**
     * The type of field to display. Known types include:
     *
     * text
     * email
     * password
     * textarea
     * checkbox
     * radio-group
     * checkbox-group
     * button-group
     */
    type: {
      type: String,
      default: null
    },
    /**
     * The name of the field. This is required when used within a `form-wrapper`
     * component, where it is used as the key for the form's data collection. As
     * such, its uniqueness will be verified by `form-wrapper` when used
     * together.
     */
    name: {
      type: String,
      default: null
    },
    /**
     * Any validation to apply to the field. This is used with the
     * externally-facing `validate` function, as well as applying attributes to
     * the field as necessary such as `required`. For more information
     * validation types, check the `form-field` docs.
     */
    validation: {
      type: Array,
      default: () => []
    }
  }, {
    modelValue: {
      type: String
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = Me(e, "modelValue"), { inputId: o } = hn(n.id), a = Mn("form-wrapper", {}), s = a == null ? void 0 : a.registerField, i = a == null ? void 0 : a.updateFieldValue, l = k(() => L(n.validation)), u = U([]), c = k(() => L(u.value)), f = U(null), d = {
      text: {},
      email: { inputAttributes: { type: "email" } },
      password: { inputAttributes: { type: "password" } },
      date: {},
      textarea: {},
      checkbox: {},
      "checkbox-group": {},
      "radio-group": {},
      "button-group": {},
      select: {}
    }, h = k(() => Object.hasOwn(d, n.type) ? n.type : B0), v = k(() => {
      switch (h.value) {
        case "textarea":
        case "checkbox":
        case "date":
        case "radio-group":
        case "checkbox-group":
        case "select":
          return `form-${h.value}`;
        case "button-group":
          return h.value;
        default:
          return L0;
      }
    }), w = k(() => {
      const N = Gn({ id: o.value }, d[h.value]);
      return !oe(N) && !l.value ? null : Gn(N, y.value);
    }), y = k(() => {
      if (!L(n.validation))
        return {};
      const N = {};
      return n.validation.forEach((j) => {
        switch (j.rule) {
          case "required":
            N.required = !0, N.inputAttributes = { required: !0 };
            break;
        }
      }), N;
    }), _ = k(() => ct(s)), C = k(() => _.value ? F(n.name) : !0);
    _e(r, () => {
      ct(i) && i(n.name, r.value);
    }), _.value && s({
      name: n.name,
      id: o.value,
      validateField: $,
      triggerFocus: O
    });
    function $(N, j) {
      return u.value = [], l.value ? (u.value = V0(N, n.validation, j), u.value) : !0;
    }
    function O() {
      ae(f.value, "triggerFocus");
    }
    return t({
      triggerFocus: O
    }), (N, j) => {
      const R = M("alert-message");
      return C.value ? (m(), x(he(v.value), I({
        key: 1,
        ref_key: "fieldRef",
        ref: f
      }, w.value, {
        modelValue: r.value,
        "onUpdate:modelValue": j[0] || (j[0] = (Z) => r.value = Z)
      }), {
        introduction: g(() => [
          b(N.$slots, "introduction")
        ]),
        prefix: g(() => [
          b(N.$slots, "prefix")
        ]),
        suffix: g(() => [
          b(N.$slots, "suffix")
        ]),
        options: g(() => [
          b(N.$slots, "options")
        ]),
        error: g(() => [
          b(N.$slots, "error", {}, () => [
            c.value ? (m(), S("ul", P0, [
              (m(!0), S(de, null, we(u.value, (Z) => (m(), S("li", { key: Z }, ne(Z), 1))), 128))
            ])) : E("", !0)
          ])
        ]),
        help: g(() => [
          b(N.$slots, "help")
        ]),
        default: g(() => [
          b(N.$slots, "default")
        ]),
        _: 3
      }, 16, ["modelValue"])) : (m(), x(R, {
        key: 0,
        type: "error"
      }, {
        title: g(() => [
          j[1] || (j[1] = V(" <form-field> — ")),
          b(N.$slots, "default")
        ]),
        default: g(() => [
          j[2] || (j[2] = V(" A parent `form-wrapper` was detected, but no `name` was provided for this field. "))
        ]),
        _: 3,
        __: [2]
      }));
    };
  }
}, Z0 = { "data-test": "form-fieldset" }, Y0 = { class: "mb-6 flex flex-col gap-4 border-b border-grey-200 pb-6" }, q0 = {
  __name: "form-fieldset",
  props: {
    /**
     * The heading level to use for this fieldset.
     */
    headingLevel: {
      type: String,
      default: "h2"
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("form-layout");
      return m(), S("div", Z0, [
        p("div", Y0, [
          (m(), x(he(e.headingLevel), { class: "text-3xl font-bold text-grey-950" }, {
            default: g(() => [
              b(t.$slots, "title")
            ]),
            _: 3
          })),
          b(t.$slots, "introduction")
        ]),
        P(r, null, {
          default: g(() => [
            b(t.$slots, "default")
          ]),
          _: 3
        })
      ]);
    };
  }
}, z0 = {}, W0 = {
  class: "flex items-center rounded-s-md py-2 ps-3",
  "data-selector": "form-prefix",
  "data-test": "form-prefix"
};
function H0(e, t) {
  return m(), S("div", W0, [
    b(e.$slots, "default")
  ]);
}
const G0 = /* @__PURE__ */ B(z0, [["render", H0]]), J0 = {}, Q0 = {
  class: "flex items-center rounded-e-md py-2 pe-3",
  "data-selector": "form-prefix",
  "data-test": "form-suffix"
};
function X0(e, t) {
  return m(), S("div", Q0, [
    b(e.$slots, "default")
  ]);
}
const K0 = /* @__PURE__ */ B(J0, [["render", X0]]), eh = {
  __name: "form-input",
  props: /* @__PURE__ */ Re({
    /**
     * Any ID to apply to this field. If an ID is not provided, one will be
     * generated at random. Note that when providing an ID, please make sure
     * that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Any placeholder to show in the input. Do not use a placeholder for
     * critical information. Always use the label and help text as priorities.
     */
    placeholder: {
      type: String,
      default: null
    },
    /**
     * Any additional attributes to pass to the input itself, such as
     * `autocomplete`.
     */
    inputAttributes: {
      type: Object,
      default: null
    },
    /**
     * Whether this field is required.
     */
    required: {
      type: Boolean,
      default: !1
    }
  }, {
    modelValue: {
      type: String
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = ke(), o = Me(e, "modelValue"), a = Ke("inputElement"), { inputId: s } = hn(n.id), { updateDescribedBy: i, describedBy: l } = Bn(s.value), u = k(() => ue(r.introduction)), c = k(() => ue(r.prefix)), f = k(() => ue(r.suffix)), d = k(() => ue(r.error));
    function h() {
      ae(a.value, "focus");
    }
    return t({
      triggerFocus: h
    }), (v, w) => {
      const y = M("conditional-wrapper");
      return m(), x(Mr, I({ haveError: d.value }, { "data-test": "form-input" }), {
        default: g(() => [
          P(kt, H(ee({ id: q(s), required: e.required })), {
            default: g(() => [
              b(v.$slots, "default")
            ]),
            _: 3
          }, 16),
          P(y, H(ee({ wrap: u.value, tag: "p" })), {
            default: g(() => [
              b(v.$slots, "introduction")
            ]),
            _: 3
          }, 16),
          p("div", {
            class: te(["flex transition-shadow", { "form-field--error": d.value }]),
            "data-selector": "form-field-wrapper",
            "data-test": "form-input-wrapper"
          }, [
            me(p("input", I({
              ref_key: "inputElement",
              ref: a,
              "onUpdate:modelValue": w[0] || (w[0] = (_) => o.value = _),
              class: ["form-input", {
                "rounded-s-none": c.value,
                "rounded-e-none": f.value
              }]
            }, {
              id: q(s),
              placeholder: e.placeholder,
              "aria-describedby": q(l),
              required: e.required,
              ...e.inputAttributes
            }), null, 16), [
              [Ei, o.value]
            ]),
            c.value ? (m(), x(G0, {
              key: 0,
              class: "order-first"
            }, {
              default: g(() => [
                b(v.$slots, "prefix")
              ]),
              _: 3
            })) : E("", !0),
            f.value ? (m(), x(K0, { key: 1 }, {
              default: g(() => [
                b(v.$slots, "suffix")
              ]),
              _: 3
            })) : E("", !0)
          ], 2),
          P(Ln, I({ inputId: q(s) }, { "onUpdate:describedby": q(i) }), {
            error: g(() => [
              b(v.$slots, "error")
            ]),
            help: g(() => [
              b(v.$slots, "help")
            ]),
            _: 3
          }, 16, ["onUpdate:describedby"])
        ]),
        _: 3
      }, 16);
    };
  }
}, th = ["onUpdate:modelValue"], nh = {
  __name: "form-input-group",
  props: /* @__PURE__ */ Re({
    /**
     * The type of input to use for this group—"radio" or "checkbox"
     */
    type: {
      type: String,
      default: null
    },
    /**
     * The input options. Options can be:
     *
     * string[] - ["option1", "option2", "option3"]
     * number[] - [1, 2, 3]
     * object   - { value: "label" }
     * object[] - [{ label: "Label", value: "value" }]
     */
    options: {
      type: [Array, Object],
      required: !0
    },
    /**
     * A name for this input group. If not set, the input ID is used.
     */
    name: {
      type: String,
      default: null
    },
    /**
     * Any ID to apply to this field. If an ID is not provided, one will be
     * generated at random. Note that when providing an ID, please make sure
     * that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Whether to display options inline (horizontally). This is only
     * recommended when there are two to three options. Any more than that, and
     * vertical display is more clear for the user.
     */
    inline: {
      type: Boolean,
      default: !1
    }
  }, {
    modelValue: {
      type: Object,
      default: {}
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = Me(e, "modelValue"), o = ke(), a = k(() => n.type === "radio"), s = k(() => n.type === "checkbox"), { inputId: i } = hn(n.id), l = k(() => n.name || i.value), { updateDescribedBy: u, describedBy: c } = Bn(i.value), f = U([]), d = k(() => ue(o.introduction)), h = k(() => {
      if (!oe(n.options) && !L(n.options))
        return [];
      const y = Fi(n.options), _ = [];
      if (oe(y))
        for (const $ in y) {
          if (!Object.hasOwn(y, $))
            continue;
          const O = y[$];
          _.push({ label: O, value: $ });
        }
      if (L(y) && y.forEach(($) => {
        const O = pe($) || F($);
        if (!(!O && !oe($))) {
          if (O) {
            _.push({ label: $, value: $ });
            return;
          }
          Object.hasOwn($, "label") && Object.hasOwn($, "value") && _.push($);
        }
      }), !L(_))
        return [];
      const C = _.length - 1;
      return _.map(($, O) => ($.first = O === 0, $.last = O === C, $.id = ln(), $));
    });
    function v() {
      if (!L(f.value))
        return;
      if (r.value === void 0) {
        w();
        return;
      }
      const y = h.value.findIndex((_) => _.value === r.value);
      if (y !== -1) {
        ae(f.value[y], "focus");
        return;
      }
      w();
    }
    function w() {
      const y = ta(f.value);
      ae(y, "focus");
    }
    return t({
      triggerFocus: v
    }), (y, _) => {
      const C = M("conditional-wrapper");
      return m(), x(Mr, I({ tag: "fieldset", "aria-describedby": q(c) }, { class: "@container" }), {
        default: g(() => [
          P(kt, H(ee({ tag: "legend" })), {
            default: g(() => [
              b(y.$slots, "default")
            ]),
            _: 3
          }, 16),
          P(C, I({ wrap: d.value, tag: "p" }, { "data-test": "form-input-group-introduction" }), {
            default: g(() => [
              b(y.$slots, "introduction")
            ]),
            _: 3
          }, 16),
          b(y.$slots, "options", H(ee({ options: h.value, name: l.value })), () => [
            p("div", {
              class: te(["flex flex-col mt-2", { "@xs:flex-row @xs:gap-10": e.inline, "gap-2": !e.inline }])
            }, [
              (m(!0), S(de, null, we(h.value, ($) => (m(), S("div", {
                key: $.id,
                class: "flex items-center gap-3"
              }, [
                a.value ? me((m(), S("input", I({
                  key: 0,
                  ref_for: !0,
                  ref_key: "inputReferences",
                  ref: f,
                  "onUpdate:modelValue": _[0] || (_[0] = (O) => r.value[l.value] = O),
                  type: "radio"
                }, { ref_for: !0 }, { id: $.id, value: $.value, name: l.value }, { class: "shrink-0 form-radio" }), null, 16)), [
                  [Ko, r.value[l.value]]
                ]) : s.value ? me((m(), S("input", I({
                  key: 1,
                  ref_for: !0,
                  ref_key: "inputReferences",
                  ref: f,
                  "onUpdate:modelValue": (O) => r.value[$.value] = O,
                  type: "checkbox"
                }, { ref_for: !0 }, { id: $.id, value: $.value, name: l.value }, { class: "shrink-0 form-checkbox" }), null, 16, th)), [
                  [sc, r.value[$.value]]
                ]) : E("", !0),
                P(kt, I({ ref_for: !0 }, { id: $.id, styled: !1 }, { class: "leading-6" }), {
                  default: g(() => [
                    V(ne($.label), 1)
                  ]),
                  _: 2
                }, 1040)
              ]))), 128))
            ], 2)
          ]),
          P(Ln, I({ inputId: q(i) }, {
            class: "mt-1",
            "onUpdate:describedby": q(u)
          }), {
            error: g(() => [
              b(y.$slots, "error")
            ]),
            help: g(() => [
              b(y.$slots, "help")
            ]),
            _: 3
          }, 16, ["onUpdate:describedby"])
        ]),
        _: 3
      }, 16);
    };
  }
}, rh = {}, oh = {
  class: "flex flex-col gap-y-8",
  "data-test": "form-layout"
};
function ah(e, t, n, r, o, a) {
  return m(), S("div", oh, [
    b(e.$slots, "default")
  ]);
}
const sh = /* @__PURE__ */ B(rh, [["render", ah]]), ih = {
  __name: "form-radio-group",
  props: {
    /**
     * Our provided model value for our input. We convert this internally into
     * something that can be provided to our input group.
     */
    modelValue: {
      type: [String, Number],
      default: null
    }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const r = e, o = n, a = Ke("input-group"), s = U({}), i = k(() => oe(s.value) ? ea(rn(s.value)) : null), l = k(() => ed(s.value));
    _e(s, () => {
      oe(s.value) && o("update:modelValue", l.value);
    }, { deep: !0 }), _e(() => r.modelValue, () => {
      F(i.value) && r.modelValue !== l.value && (s.value = { [i.value]: r.modelValue });
    });
    function u() {
      ae(a.value, "triggerFocus");
    }
    return t({
      triggerFocus: u
    }), (c, f) => {
      const d = M("form-input-group");
      return m(), x(d, I({
        ref: "input-group",
        modelValue: s.value,
        "onUpdate:modelValue": f[0] || (f[0] = (h) => s.value = h)
      }, { type: "radio" }, { "data-test": "form-radio-group" }), {
        introduction: g(() => [
          b(c.$slots, "introduction")
        ]),
        options: g(({ options: h, name: v }) => [
          b(c.$slots, "options", H(ee({ options: h, name: v })))
        ]),
        help: g(() => [
          b(c.$slots, "help")
        ]),
        error: g(() => [
          b(c.$slots, "error")
        ]),
        default: g(() => [
          b(c.$slots, "default")
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
}, lh = {
  key: 0,
  value: ""
}, uh = ["value"], ch = {
  __name: "form-select",
  props: /* @__PURE__ */ Re({
    /**
     * The options for this select. Options can either be a string, which is
     * used for both the label and the value, or a `{ label, value }` object,
     * allowing them to differ.
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * Whether to allow an empty option, the label of which can be provided via
     * the `empty-option-label` slot..
     */
    allowEmpty: {
      type: Boolean,
      default: !0
    },
    /**
     * Any ID to apply to this field. If an ID is not provided, one will be
     * generated at random. Note that when providing an ID, please make sure
     * that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Any additional attributes to pass to the input itself, such as
     * `autocomplete`.
     */
    inputAttributes: {
      type: Object,
      default: null
    },
    /**
     * Whether this field is required. If not required, a field's label is
     * updated with `optional` text.
     */
    required: {
      type: Boolean,
      default: !1
    }
  }, {
    modelValue: {
      type: String,
      default: ""
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = ke(), o = Me(e, "modelValue"), a = Ke("select-element"), { inputId: s } = hn(n.id), { updateDescribedBy: i, describedBy: l } = Bn(s.value), u = k(() => ue(r.introduction)), c = k(() => ue(r.error)), f = k(() => L(n.options) ? n.options.reduce((h, v) => (F(v) && h.push({ label: v, value: v }), oe(v) && Object.hasOwn(v, "label") && Object.hasOwn(v, "value") && h.push(v), h), []) : []);
    n.allowEmpty !== !0 && (o.value = Q(ea(f.value), "value"));
    function d() {
      ae(a.value, "focus");
    }
    return t({
      triggerFocus: d
    }), (h, v) => {
      const w = M("conditional-wrapper");
      return m(), x(Mr, I({ haveError: c.value }, { "data-test": "form-select" }), {
        default: g(() => [
          P(kt, H(ee({ id: q(s), required: e.required })), {
            default: g(() => [
              b(h.$slots, "default")
            ]),
            _: 3
          }, 16),
          P(w, H(ee({ wrap: u.value, tag: "p" })), {
            default: g(() => [
              b(h.$slots, "introduction")
            ]),
            _: 3
          }, 16),
          p("div", {
            class: te(["flex transition-shadow", { "form-field--error": c.value }]),
            "data-selector": "form-field-wrapper",
            "data-test": "form-input-wrapper"
          }, [
            me(p("select", I({
              ref: "select-element",
              "onUpdate:modelValue": v[0] || (v[0] = (y) => o.value = y),
              class: "form-select"
            }, {
              id: q(s),
              "aria-describedby": q(l),
              required: e.required,
              ...e.inputAttributes
            }), [
              e.allowEmpty ? (m(), S("option", lh, [
                b(h.$slots, "empty-option-label", {}, () => [
                  v[1] || (v[1] = V(" Please select… "))
                ])
              ])) : E("", !0),
              (m(!0), S(de, null, we(f.value, (y) => (m(), S("option", {
                key: y.value,
                value: y.value
              }, ne(y.label), 9, uh))), 128))
            ], 16), [
              [ic, o.value]
            ])
          ], 2),
          P(Ln, I({ inputId: q(s) }, { "onUpdate:describedby": q(i) }), {
            error: g(() => [
              b(h.$slots, "error")
            ]),
            help: g(() => [
              b(h.$slots, "help")
            ]),
            _: 3
          }, 16, ["onUpdate:describedby"])
        ]),
        _: 3
      }, 16);
    };
  }
}, dh = {
  __name: "form-textarea",
  props: /* @__PURE__ */ Re({
    /**
     * Any ID to apply to this field. If an ID is not provided, one will be
     * generated at random. Note that when providing an ID, please make sure
     * that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Any placeholder to show in the input. Do not use a placeholder for
     * critical information. Always use the label and help text as priorities.
     */
    placeholder: {
      type: String,
      default: null
    },
    /**
     * Any additional attributes to pass to the input itself, such as
     * `autocomplete`.
     */
    inputAttributes: {
      type: Object,
      default: null
    },
    /**
     * Whether this field is required.
     */
    required: {
      type: Boolean,
      default: !1
    }
  }, {
    modelValue: {
      type: String
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = ke(), o = Me(e, "modelValue"), a = Ke("inputElement"), { inputId: s } = hn(n.id), { updateDescribedBy: i, describedBy: l } = Bn(s.value), u = k(() => ue(r.introduction)), c = k(() => ue(r.error));
    function f() {
      ae(a.value, "focus");
    }
    return t({
      triggerFocus: f
    }), (d, h) => {
      const v = M("conditional-wrapper");
      return m(), x(Mr, I({ haveError: c.value }, { "data-test": "form-textarea" }), {
        default: g(() => [
          P(kt, H(ee({ id: q(s), required: e.required })), {
            default: g(() => [
              b(d.$slots, "default")
            ]),
            _: 3
          }, 16),
          P(v, H(ee({ wrap: u.value, tag: "p" })), {
            default: g(() => [
              b(d.$slots, "introduction")
            ]),
            _: 3
          }, 16),
          p("div", {
            class: te(["flex transition-shadow", { "form-field--error": c.value }]),
            "data-selector": "form-field-wrapper",
            "data-test": "form-input-wrapper"
          }, [
            me(p("textarea", I({
              ref_key: "inputElement",
              ref: a,
              "onUpdate:modelValue": h[0] || (h[0] = (w) => o.value = w),
              class: "form-input"
            }, {
              id: q(s),
              placeholder: e.placeholder,
              "aria-describedby": q(l),
              required: e.required,
              ...e.inputAttributes
            }), null, 16), [
              [lc, o.value]
            ])
          ], 2),
          P(Ln, I({ inputId: q(s) }, { "onUpdate:describedby": q(i) }), {
            error: g(() => [
              b(d.$slots, "error")
            ]),
            help: g(() => [
              b(d.$slots, "help")
            ]),
            _: 3
          }, 16, ["onUpdate:describedby"])
        ]),
        _: 3
      }, 16);
    };
  }
}, fh = { class: "mb-2 font-bold" }, ph = { class: "list-disc ps-4" }, mh = ["href", "onClick"], hh = {
  __name: "form-wrapper",
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    modelModifiers: {}
  },
  emits: /* @__PURE__ */ Re(["submit"], ["update:modelValue"]),
  setup(e, { emit: t }) {
    const n = t, r = ke(), o = k(() => ue(r["submit-button-label"])), a = Me(e, "modelValue"), s = uc({}), i = k(() => oe(s)), l = U([]), u = k(() => L(l.value)), c = U(null);
    async function f(_) {
      it(a.value) || (a.value = {}, await Xn()), Object.hasOwn(a.value, _.name) && console.error("<form-wrapper>", `Duplicate field name <${_.name}> detected. This only one field with a given name will be represented in form data.`), s[_.name] = _, a.value[_.name] = null;
    }
    async function d(_, C) {
      a.value[_] = C;
    }
    Qr("form-wrapper", {
      registerField: f,
      updateFieldValue: d
    });
    async function h() {
      if (!i.value) {
        w();
        return;
      }
      if (v(), u.value) {
        await Xn(), ae(c.value, "focus");
        return;
      }
      w();
    }
    function v() {
      l.value = [];
      for (const _ in s) {
        if (!Object.hasOwn(s, _))
          continue;
        const C = s[_];
        if (!ct(C.validateField))
          continue;
        const $ = C.validateField(_, a.value);
        L($) && $.forEach((O) => {
          l.value.push({ fieldName: _, id: C.id, message: O });
        });
      }
    }
    function w() {
      n("submit", a.value);
    }
    function y(_) {
      Object.hasOwn(s, _) && ae(s[_], "triggerFocus");
    }
    return (_, C) => {
      const $ = M("alert-message"), O = M("ui-button"), N = M("form-actions"), j = M("form-layout");
      return m(), S("form", {
        novalidate: "",
        "data-test": "form-wrapper",
        onSubmit: Lo(h, ["prevent"])
      }, [
        me(p("div", {
          ref_key: "errorSummaryElement",
          ref: c,
          tabindex: "0",
          class: "mb-4 w-full rounded-sm border border-red-200 bg-red-50 p-4 text-red-800 dark:border-transparent dark:bg-red-500/50 dark:text-red-200",
          "data-test": "form-wrapper-error-summary"
        }, [
          p("h2", fh, [
            b(_.$slots, "error-summary-title", {}, () => [
              C[0] || (C[0] = V(" There is a problem "))
            ])
          ]),
          p("ul", ph, [
            (m(!0), S(de, null, we(l.value, (R) => (m(), S("li", {
              key: R.id
            }, [
              p("a", {
                href: `#${R.id}`,
                class: "text-current",
                "data-test": "form-wrapper-error-summary-message",
                onClick: Lo((Z) => y(R.fieldName), ["prevent"])
              }, ne(R.message), 9, mh)
            ]))), 128))
          ])
        ], 512), [
          [Ie, u.value]
        ]),
        b(_.$slots, "pre-form"),
        P(j, null, {
          default: g(() => [
            b(_.$slots, "default"),
            P(N, null, {
              "tertiary-actions": g(() => [
                b(_.$slots, "tertiary-actions")
              ]),
              default: g(() => [
                o.value ? E("", !0) : (m(), x($, {
                  key: 0,
                  type: "error",
                  "data-test": "form-wrapper-submit-button-label-error"
                }, {
                  title: g(() => C[1] || (C[1] = [
                    V(" <form-wrapper> ")
                  ])),
                  default: g(() => [
                    C[2] || (C[2] = p("p", null, [
                      V("The slot "),
                      p("code", null, "`submit-button-label`"),
                      V(" is required to provide a meaningful call to action for the form.")
                    ], -1))
                  ]),
                  _: 1,
                  __: [2]
                })),
                o.value ? (m(), x(O, {
                  key: 1,
                  type: "submit",
                  class: "button--primary",
                  "data-test": "form-wrapper-submit-button"
                }, {
                  default: g(() => [
                    b(_.$slots, "submit-button-label")
                  ]),
                  _: 3
                })) : E("", !0),
                b(_.$slots, "secondary-actions")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ], 32);
    };
  }
}, vh = {
  inheritAttrs: !1
}, gh = /* @__PURE__ */ Object.assign(vh, {
  __name: "image-tag",
  props: {
    /**
     * The source of the image.
     */
    src: {
      type: String,
      required: !0
    }
  },
  emits: ["error"],
  setup(e, { emit: t }) {
    const n = t, r = U(!1);
    function o() {
      r.value = !0, n("error");
    }
    return (a, s) => {
      const i = M("icon-image");
      return r.value ? b(a.$slots, "fallback", { key: 1 }, () => [
        p("div", I({ class: "flex items-center justify-center bg-grey-100 p-3" }, a.$attrs, { "data-test": "image-tag-fallback" }), [
          P(i, { class: "aspect-square h-auto w-8 max-w-full text-grey-500" })
        ], 16)
      ]) : (m(), S("img", I({
        key: 0,
        class: "bg-grey-100",
        "data-test": "image-tag"
      }, { ...a.$attrs, src: e.src }, {
        onLoad: s[0] || (s[0] = (...l) => a.handleImageLoad && a.handleImageLoad(...l)),
        onError: o
      }), null, 16));
    };
  }
}), yh = {
  __name: "link-tag",
  props: {
    /**
     * The href for this link.
     */
    href: {
      type: String,
      required: !0
    },
    /**
     * Whether this is an external link, which sets target _blank and shows an
     * external indicator.
     */
    external: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to show the external icon. Only applies if external is true.
     */
    showExternalIcon: {
      type: Boolean,
      default: !0
    },
    /**
     * An icon to display at the start of the button.
     */
    iconStart: {
      type: String,
      default: null
    },
    /**
     * An icon to display at the end of the button.
     */
    iconEnd: {
      type: String,
      default: null
    }
  },
  setup(e, { expose: t }) {
    const n = e, r = Ke("anchorElement"), o = k(() => F(n.iconStart)), a = k(() => F(n.iconEnd)), s = k(() => n.external && n.showExternalIcon), i = k(() => a.value && !s.value), l = k(() => {
      const c = {};
      return n.external && (c.target = "_blank"), c;
    });
    function u() {
      ae(r.value, "focus");
    }
    return t({
      triggerFocus: u
    }), (c, f) => {
      const d = M("icon-external");
      return m(), S("a", I({
        ref_key: "anchorElement",
        ref: r,
        class: "inline-flex items-center gap-[0.5em]"
      }, { href: e.href, ...l.value }, { "data-test": "link-tag" }), [
        o.value ? (m(), x(he(e.iconStart), {
          key: 0,
          class: "size-[0.857em] stroke-current",
          "data-test": "link-tag-icon-start"
        })) : E("", !0),
        b(c.$slots, "default"),
        i.value ? (m(), x(he(e.iconEnd), {
          key: 1,
          class: "size-[0.857em] stroke-current",
          "data-test": "link-tag-icon-end"
        })) : s.value ? (m(), x(d, {
          key: 2,
          class: "size-[0.857em] stroke-current",
          "data-test": "link-tag-icon-external"
        })) : E("", !0)
      ], 16);
    };
  }
}, bh = {
  __name: "loading-indicator",
  props: {
    /**
     * Whether to display a larger version of the loading indicator.
     */
    large: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("icon-loading");
      return m(), S("div", {
        class: te(["flex items-center gap-2", { "flex-col": e.large }]),
        "aria-live": "polite",
        "data-test": "loading-indicator"
      }, [
        P(r, {
          class: te(["spin text-grey-500 dark:text-grey-400", { "size-7": e.large }])
        }, null, 8, ["class"]),
        b(t.$slots, "default")
      ], 2);
    };
  }
}, _h = {
  key: 0,
  class: "mb-6 text-2xl font-bold text-grey-950"
}, wh = {
  key: 1,
  class: "mt-12 flex items-center gap-6 border-t border-grey-200 dark:border-white/60 pt-6"
}, kh = {
  __name: "modal-dialog",
  props: {
    /**
     * Whether the dialog should be open when it loads.
     */
    initiallyOpen: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to focus the dialog itself on open, or the first focusable
     * element within it.
     */
    focusDialogOnOpen: {
      type: Boolean,
      default: !0
    },
    // i18n
    /**
     * The label for the built-in close dialog button.
     */
    closeDialogLabel: {
      type: String,
      default: "Close dialog"
    }
  },
  emits: ["@dialog:close"],
  setup(e, { expose: t, emit: n }) {
    const r = e, o = n, a = ke(), s = k(() => ue(a.title)), i = k(() => ue(a.actions)), l = U(null);
    u();
    function u() {
      r.initiallyOpen === !0 && c();
    }
    function c() {
      l.value && (ae(l.value, "showModal"), r.focusDialogOnOpen === !0 && ae(l.value, "focus"));
    }
    function f() {
      l.value && (ae(l.value, "close"), o("@dialog:close"));
    }
    return t({
      open: c,
      close: f
    }), (d, h) => {
      const v = M("icon-cross"), w = M("ui-button");
      return m(), S("dialog", {
        ref_key: "dialog",
        ref: l,
        class: "fixed start-1/2 top-1/2 -translate-1/2 w-full max-w-2xl rounded-md border border-grey-300 p-12 text-current shadow-2xl dark:border-white/20",
        "data-test": "modal-dialog"
      }, [
        P(w, I({ class: "absolute end-0 top-0 me-4 mt-4 rounded-sm p-3 hocus:bg-grey-200 dark:hocus:bg-white/20" }, { "aria-label": e.closeDialogLabel }, {
          "data-test": "modal-dialog-close",
          onClick: f
        }), {
          default: g(() => [
            P(v)
          ]),
          _: 1
        }, 16),
        s.value ? (m(), S("h2", _h, [
          b(d.$slots, "title")
        ])) : E("", !0),
        b(d.$slots, "default"),
        i.value ? (m(), S("div", wh, [
          b(d.$slots, "actions")
        ])) : E("", !0)
      ], 512);
    };
  }
}, $h = ["data-test"], Ch = ["data-test"], xh = ["data-test"], Mh = ["data-test"], Sh = ["data-test"], Ih = ["data-test"], Sr = {
  __name: "notification-base",
  props: {
    /**
     * The details of the notification to display.
     */
    notification: {
      type: Object,
      default: () => ({})
    },
    /**
     * Whether to allow this notification to be marked as read.
     */
    allowMarkRead: {
      type: Boolean,
      default: !0
    },
    /**
     * The locale to use when displaying dates.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: null
    },
    /**
     * Any classes to apply to the "stripe", which appears to the left of the
     * notification.
     */
    stripeClasses: {
      type: String,
      default: "bg-grey-100"
    },
    /**
     * Any classes to apply to the box around a displayed icon, which appears to
     * the left of the notification content.
     */
    iconBackgroundClasses: {
      type: String,
      default: "bg-grey-50"
    },
    /**
     * Any classes to apply to the displayed icon, which appears to the left of
     * the notification content inside a box.
     */
    iconClasses: {
      type: String,
      default: "text-grey-500"
    },
    /**
     * Any classes to apply to the title for this notification.
     */
    titleClasses: {
      type: String,
      default: "text-grey-950"
    },
    /**
     * Any classes to apply to the text of the notification itself.
     */
    textClasses: {
      type: String,
      default: null
    },
    /**
     * Any classes to apply to the "badge", which appears to the right of the
     * notification.
     */
    badgeClasses: {
      type: String,
      default: "bg-grey-500"
    },
    /**
     * The data-test attribute, which is used to customise this notification for
     * testing.
     */
    dataTest: {
      type: String,
      default: "notification-base"
    }
  },
  emits: ["notification:read"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = ke(), a = k(() => Q(n, "notification.id")), s = k(() => F(a.value)), i = k(() => F(Q(n, "notification.title"))), l = k(() => F(Q(n, "notification.date"))), u = k(() => F(Q(n, "notification.image_url"))), c = k(() => F(Q(n, "notification.icon"))), f = k(() => F(Q(n, "notification.url"))), d = k(() => ue(o.actions)), h = k(() => n.allowMarkRead === !0 && s.value === !0), v = k(() => f.value || h.value || d.value);
    function w() {
      h.value && r("notification:read", a.value);
    }
    return (y, _) => {
      const C = M("image-tag"), $ = M("display-date"), O = M("conditional-wrapper"), N = M("link-tag"), j = M("ui-button");
      return m(), S("div", {
        class: "relative py-4 ps-8 pe-12",
        "data-test": e.dataTest
      }, [
        p("div", {
          class: te(["absolute inset-y-0 start-0 w-1 rounded-full", e.stripeClasses]),
          "data-test": `${e.dataTest}-stripe`
        }, null, 10, Ch),
        P(O, I({ wrap: u.value || c.value }, { class: "flex items-start gap-4" }), {
          default: g(() => [
            u.value ? (m(), x(C, {
              key: 0,
              src: e.notification.image_url,
              class: "size-10 rounded-md object-cover",
              "data-test": `${e.dataTest}-image`
            }, null, 8, ["src", "data-test"])) : c.value ? (m(), S("div", {
              key: 1,
              class: te(["w-10 rounded-md p-3", e.iconBackgroundClasses]),
              "data-test": `${e.dataTest}-icon`
            }, [
              (m(), x(he(e.notification.icon), {
                class: te(["size-4.5", e.iconClasses])
              }, null, 8, ["class"]))
            ], 10, xh)) : E("", !0),
            P(O, H(ee({ wrap: u.value || c.value })), {
              default: g(() => [
                i.value ? (m(), S("h3", {
                  key: 0,
                  class: te(["font-semibold", e.titleClasses]),
                  "data-test": `${e.dataTest}-title`
                }, ne(e.notification.title), 11, Mh)) : E("", !0),
                p("div", {
                  class: te(e.textClasses)
                }, ne(e.notification.message), 3),
                l.value ? (m(), x($, I({
                  key: 1,
                  class: "mt-2 block text-xs text-grey-500"
                }, { date: e.notification.date, locale: e.locale, format: e.dateFormat }, {
                  "data-test": `${e.dataTest}-date`
                }), null, 16, ["data-test"])) : E("", !0)
              ]),
              _: 1
            }, 16)
          ]),
          _: 1
        }, 16),
        v.value ? (m(), S("div", {
          key: 0,
          class: te(["mt-2 flex items-center gap-4 text-xs", { "ps-14": u.value || c.value }]),
          "data-test": `${e.dataTest}-actions`
        }, [
          f.value ? (m(), x(N, I({ key: 0 }, { href: e.notification.url, external: !0 }, {
            "data-test": `${e.dataTest}-view-more`
          }), {
            default: g(() => [
              b(y.$slots, "view-more-label", {}, () => [
                _[0] || (_[0] = V(" View more "))
              ])
            ]),
            _: 3
          }, 16, ["data-test"])) : E("", !0),
          h.value ? (m(), x(j, I({ key: 1 }, { iconStart: "icon-check" }, {
            class: "button--muted",
            "data-test": `${e.dataTest}-mark-read`,
            onClick: w
          }), {
            default: g(() => [
              b(y.$slots, "mark-read-label", {}, () => [
                _[1] || (_[1] = V(" Mark as read "))
              ])
            ]),
            _: 3
          }, 16, ["data-test"])) : E("", !0),
          b(y.$slots, "actions", H(ee({ notification: e.notification })))
        ], 10, Sh)) : E("", !0),
        b(y.$slots, "badge", {}, () => [
          p("div", {
            class: te(["absolute end-0 top-0", [e.badgeClasses, "bg-current size-2 rounded-full me-6 mt-5.5"]]),
            "data-test": `${e.dataTest}-badge`
          }, null, 10, Ih)
        ])
      ], 8, $h);
    };
  }
}, Oh = {
  __name: "notification-danger",
  props: {
    /**
     * The details of the notification to display.
     */
    notification: {
      type: Object,
      default: () => ({})
    },
    /**
     * The locale to use when displaying dates.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: null
    }
  },
  setup(e) {
    return (t, n) => (m(), x(Sr, I({ class: "bg-red-50/50 rounded-e-lg" }, {
      notification: e.notification,
      locale: e.locale,
      dateFormat: e.dateFormat,
      stripeClasses: "bg-red-100",
      iconBackgroundClasses: "bg-red-50",
      iconClasses: "text-red-600",
      badgeClasses: "text-red-600",
      titleClasses: "text-red-800"
    }, { "data-test": "notification-danger" }), {
      "view-more-label": g(() => [
        b(t.$slots, "view-more-label")
      ]),
      actions: g((r) => [
        b(t.$slots, "actions", H(ee(r || {})))
      ]),
      _: 3
    }, 16));
  }
}, Eh = {
  __name: "notification-info",
  props: {
    /**
     * The details of the notification to display.
     */
    notification: {
      type: Object,
      default: () => ({})
    },
    /**
     * The locale to use when displaying dates.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: null
    }
  },
  setup(e) {
    return (t, n) => (m(), x(Sr, I({
      notification: e.notification,
      locale: e.locale,
      dateFormat: e.dateFormat,
      stripeClasses: "bg-purple-100",
      iconBackgroundClasses: "bg-purple-50",
      iconClasses: "text-purple-600",
      badgeClasses: "text-purple-600"
    }, { "data-test": "notification-info" }), {
      "view-more-label": g(() => [
        b(t.$slots, "view-more-label")
      ]),
      actions: g((r) => [
        b(t.$slots, "actions", H(ee(r || {})))
      ]),
      _: 3
    }, 16));
  }
}, Dh = {
  __name: "notification-pinned",
  props: {
    /**
     * The details of the notification to display.
     */
    notification: {
      type: Object,
      default: () => ({})
    },
    /**
     * The locale to use when displaying dates.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: null
    }
  },
  setup(e) {
    return (t, n) => {
      const r = M("icon-pin");
      return m(), x(Sr, I({
        notification: e.notification,
        allowMarkRead: !1,
        locale: e.locale,
        dateFormat: e.dateFormat,
        stripeClasses: "bg-purple-100",
        iconBackgroundClasses: "bg-purple-50",
        iconClasses: "text-purple-600",
        badgeClasses: "text-purple-600"
      }, { "data-test": "notification-pinned" }), {
        "view-more-label": g(() => [
          b(t.$slots, "view-more-label")
        ]),
        actions: g((o) => [
          b(t.$slots, "actions", H(ee(o || {})))
        ]),
        badge: g(() => [
          P(r, {
            class: "absolute end-0 top-0 me-5 mt-4.5 size-4 text-purple-600",
            "data-test": "notification-pinned-badge"
          })
        ]),
        _: 3
      }, 16);
    };
  }
}, Th = {
  __name: "notification-read",
  props: {
    /**
     * The details of the notification to display.
     */
    notification: {
      type: Object,
      default: () => ({})
    },
    /**
     * The locale to use when displaying dates.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: null
    }
  },
  setup(e) {
    return (t, n) => (m(), x(Sr, I({
      notification: e.notification,
      allowMarkRead: !1,
      locale: e.locale,
      dateFormat: e.dateFormat,
      stripeClasses: "hidden",
      badgeClasses: "hidden",
      titleClasses: "text-grey-500",
      textClasses: "text-grey-500"
    }, { "data-test": "notification-read" }), {
      "view-more-label": g(() => [
        b(t.$slots, "view-more-label")
      ]),
      actions: g((r) => [
        b(t.$slots, "actions", H(ee(r || {})))
      ]),
      _: 3
    }, 16));
  }
}, Nh = {
  __name: "notification-warning",
  props: {
    /**
     * The details of the notification to display.
     */
    notification: {
      type: Object,
      default: () => ({})
    },
    /**
     * The locale to use when displaying dates.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: null
    }
  },
  setup(e) {
    return (t, n) => (m(), x(Sr, I({ class: "bg-orange-50/50 rounded-e-lg" }, {
      notification: e.notification,
      locale: e.locale,
      dateFormat: e.dateFormat,
      stripeClasses: "bg-orange-100",
      iconBackgroundClasses: "bg-orange-50",
      iconClasses: "text-orange-600",
      badgeClasses: "text-orange-600",
      titleClasses: "text-orange-800"
    }, { "data-test": "notification-warning" }), {
      "view-more-label": g(() => [
        b(t.$slots, "view-more-label")
      ]),
      actions: g((r) => [
        b(t.$slots, "actions", H(ee(r || {})))
      ]),
      _: 3
    }, 16));
  }
}, jh = { class: "sr-only" }, Rh = {
  key: 0,
  class: "absolute end-0 top-0 -me-2 -mt-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-800 p-1 text-xs leading-none text-white",
  "data-test": "notification-handler-badge"
}, Fh = { key: 1 }, Vh = {
  key: 0,
  class: "flex flex-col gap-4"
}, Ah = {
  key: 0,
  class: "flex items-center justify-between text-xs",
  "data-test": "notification-handler-toolbar"
}, Ph = {
  class: "flex flex-col gap-4",
  "data-test": "notification-handler-notifications"
}, Bh = {
  key: 0,
  class: "border-grey-200"
}, Lh = {
  key: 1,
  class: "flex flex-col items-center gap-2 py-4"
}, Uh = { class: "animate-fade-in delay" }, Zh = {
  __name: "notification-handler",
  props: {
    /**
     * The notifications to display to the user.
     */
    notifications: {
      type: Array,
      default: null
    },
    /**
     * The locale to use when displaying dates. To reset to the user's
     * locale settings, set the locale to undefined.
     */
    locale: {
      type: String,
      default: void 0
    },
    /**
     * The date format to use in the display of the date. To reset to the user's
     * locale settings, set the format to null.
     */
    dateFormat: {
      type: Object,
      default: () => ({
        year: "numeric",
        day: "numeric",
        month: "long"
      })
    },
    /**
     * The alignment of the pop up notifications panel. Anything but "start"
     * will be treated as "end".
     */
    align: {
      type: String,
      default: "end"
    },
    /**
     * Whether to display the “Mark all read” button. Deactivating means the
     * user will be required to mark notifications as read individually.
     */
    allowMarkAllRead: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether to display the “Reload” button. Deactivating means new
     * notifications will only be shown when something triggers a re-load in the
     * parent component.
     */
    allowReload: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether the notifications are currently loading (or re-loading). This
     * will show a loading indicator to the user to provide feedback.
     */
    loading: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to hide notifications when they are marked as read. If false,
     * notifications will remain, but will appear less prominent. If true, any
     * notifications that are already read when initialised will not be shown.
     */
    hideNotificationsWhenRead: {
      type: Boolean,
      default: !1
    },
    /**
     * The number of read notifications to display at maximum. Unread
     * notifications are always shown.
     */
    readNotificationCount: {
      type: Number,
      default: null
    }
  },
  emits: ["notifications:read", "notifications:reload"],
  setup(e, { emit: t }) {
    const n = e, r = t, [o, a] = yd(), s = U([]), i = k(() => {
      if (!L(n.notifications))
        return [];
      let D = n.notifications.reduce((z, re) => (!oe(re) || !Object.hasOwn(re, "message") || n.hideNotificationsWhenRead && (Q(re, "read") === !0 || Z(re.id)) || z.push(re), z), []);
      return D = _(D), D = C(D), D;
    }), l = k(() => L(i.value)), u = k(() => l.value ? i.value.filter((D) => Q(D, "read") !== !0) : []), c = k(() => l.value ? wt(u.value) : 0), f = k(() => c.value > 0), d = k(() => n.allowMarkAllRead && f.value), h = k(() => i.value.filter((D) => Q(D, "pinned") === !0)), v = k(() => L(h.value)), w = k(() => i.value.filter((D) => Q(D, "pinned") !== !0)), y = k(() => L(w.value));
    function _(D) {
      return D.sort((z, re) => {
        const Se = Q(z, "date"), le = Q(re, "date");
        return Se === null && le === null ? 0 : Se === null ? 1 : le === null ? -1 : new Date(le) - new Date(Se);
      });
    }
    function C(D) {
      if (!pe(n.readNotificationCount))
        return D;
      if (!L(D))
        return [];
      let z = 0;
      return D.filter((re) => Q(re, "read") !== !0 ? !0 : z < n.readNotificationCount ? (z++, !0) : !1);
    }
    function $(D) {
      return Q(D, "read") === !0 || Z(Q(D, "id")) ? "notification-read-template" : Q(D, "type") === "danger" ? "notification-danger-template" : Q(D, "type") === "warning" ? "notification-warning-template" : "notification-info-template";
    }
    function O(D) {
      return Q(D, "pinned") === !0 ? Dh : Q(D, "read") === !0 || Z(Q(D, "id")) ? Th : Q(D, "type") === "danger" ? Oh : Q(D, "type") === "warning" ? Nh : Eh;
    }
    function N(D) {
      F(D) && (r("notifications:read", [D]), s.value.push(D));
    }
    function j() {
      n.allowReload && r("notifications:reload");
    }
    function R() {
      if (!f.value)
        return;
      const D = u.value.filter((re) => Q(re, "pinned") !== !0), z = dc(D, "id");
      L(z) && (r("notifications:read", [z]), s.value.push(...z));
    }
    function Z(D) {
      return !F(D) || !L(s.value) ? !1 : s.value.includes(D);
    }
    return (D, z) => {
      const re = M("icon-bell"), Se = M("loading-indicator"), le = M("ui-button"), G = M("floating-details");
      return m(), x(G, I({ includeIcon: !1, align: e.align, summaryClasses: "button--muted relative p-3" }, {
        class: "w-min text-sm",
        "data-test": "notification-handler"
      }), {
        summary: g(() => [
          P(re),
          p("span", jh, [
            b(D.$slots, "show-notifications-label", {}, () => [
              z[0] || (z[0] = V(" Show notifications "))
            ])
          ]),
          f.value ? (m(), S("div", Rh, ne(c.value), 1)) : E("", !0)
        ]),
        default: g(() => [
          P(q(o), null, {
            default: g(({ notification: J }) => [
              b(D.$slots, $(J), H(ee({ notification: J, markNotificationRead: () => N(J.id) })), () => [
                (m(), x(he(O(J)), I({ notification: J, locale: e.locale, dateFormat: e.dateFormat }, {
                  class: "animate-fade-in delay",
                  "onNotification:read": N
                }), {
                  "view-more-label": g(() => [
                    b(D.$slots, "view-more-label")
                  ]),
                  actions: g(($e) => [
                    b(D.$slots, "notification-actions", H(ee($e)))
                  ]),
                  _: 2
                }, 1040))
              ])
            ]),
            _: 3
          }),
          n.loading ? (m(), x(Se, H(I({ key: 0 }, { large: !0 })), {
            default: g(() => [
              b(D.$slots, "loading-label", {}, () => [
                z[1] || (z[1] = V(" Loading notifications "))
              ])
            ]),
            _: 3
          }, 16)) : E("", !0),
          n.loading ? E("", !0) : (m(), S("div", Fh, [
            l.value ? (m(), S("div", Vh, [
              d.value || e.allowReload ? (m(), S("div", Ah, [
                e.allowReload ? (m(), x(le, {
                  key: 0,
                  class: "button--muted",
                  "icon-start": "icon-reload",
                  "data-test": "notification-handler-reload",
                  onClick: j
                }, {
                  default: g(() => [
                    b(D.$slots, "reload-label", {}, () => [
                      z[2] || (z[2] = V(" Reload notifications "))
                    ])
                  ]),
                  _: 3
                })) : E("", !0),
                d.value ? (m(), x(le, {
                  key: 1,
                  class: "button--muted",
                  "icon-start": "icon-check",
                  "data-test": "notification-handler-mark-all-read",
                  onClick: R
                }, {
                  default: g(() => [
                    b(D.$slots, "mark-all-read-label", {}, () => [
                      z[3] || (z[3] = V(" Mark all notifications read "))
                    ])
                  ]),
                  _: 3
                })) : E("", !0)
              ])) : E("", !0),
              p("div", Ph, [
                (m(!0), S(de, null, we(h.value, (J) => b(D.$slots, "notification-pinned-template", I({
                  key: J.id,
                  ref_for: !0
                }, { notification: J }), () => [
                  P(q(a), I({ ref_for: !0 }, { notification: J }), null, 16)
                ])), 128)),
                v.value && y.value ? (m(), S("hr", Bh)) : E("", !0),
                (m(!0), S(de, null, we(w.value, (J) => (m(), x(q(a), I({
                  key: J.id,
                  ref_for: !0
                }, { notification: J }), null, 16))), 128))
              ])
            ])) : (m(), S("div", Lh, [
              P(re, { class: "animate-fade-in delay size-10 rounded-full bg-purple-100 p-3 text-purple-800" }),
              p("span", Uh, [
                b(D.$slots, "no-notifications-label", {}, () => [
                  z[4] || (z[4] = V(" No new notifications "))
                ])
              ])
            ]))
          ]))
        ]),
        _: 3
      }, 16);
    };
  }
};
function Yh(e) {
  return /\btext-(xs|sm|base|lg|xl|\dxl)\b/.test(e);
}
const qh = {
  __name: "pill-badge",
  props: {
    /**
     * The colour of this badge.
     *
     * grey, red, orange, yellow, green, teal, blue, indigo, purple, pink
     */
    colour: {
      type: String,
      default: "grey"
    },
    /**
     * An icon to display at the start of the button.
     */
    iconStart: {
      type: String,
      default: null
    },
    /**
     * An icon to display at the end of the button.
     */
    iconEnd: {
      type: String,
      default: null
    }
  },
  setup(e) {
    const t = e, n = Di(), r = k(() => F(t.iconStart)), o = k(() => F(t.iconEnd)), a = k(() => Yh(n.class) ? null : "text-xs"), s = k(() => {
      switch (t.colour) {
        case "red":
          return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/50 dark:text-red-200 dark:ring-0";
        case "orange":
          return "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/50 dark:text-orange-200 dark:ring-0";
        case "yellow":
          return "bg-yellow-50 text-yellow-700 ring-yellow-200 dark:bg-yellow-500/50 dark:text-yellow-200 dark:ring-0";
        case "green":
          return "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/50 dark:text-green-200 dark:ring-0";
        case "teal":
          return "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/50 dark:text-teal-200 dark:ring-0";
        case "blue":
          return "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/50 dark:text-blue-200 dark:ring-0";
        case "indigo":
          return "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/50 dark:text-indigo-200 dark:ring-0";
        case "purple":
          return "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/50 dark:text-purple-200 dark:ring-0";
        case "pink":
          return "bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-500/50 dark:text-pink-200 dark:ring-0";
        default:
          return "bg-grey-50 text-grey-700 ring-grey-200 dark:bg-white/20 dark:text-grey-200 dark:ring-0";
      }
    });
    return (i, l) => (m(), S("span", {
      class: te(["inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium ring-1 ring-inset", [a.value, s.value]]),
      "data-test": "pill-badge"
    }, [
      r.value ? (m(), x(he(e.iconStart), {
        key: 0,
        class: "stroke-current",
        "data-test": "pill-badge-icon-start"
      })) : E("", !0),
      b(i.$slots, "default"),
      o.value ? (m(), x(he(e.iconEnd), {
        key: 1,
        class: "stroke-current",
        "data-test": "pill-badge-icon-end"
      })) : E("", !0)
    ], 2));
  }
}, zh = {
  key: 1,
  class: "ms-auto",
  "data-test": "progress-bar-value"
}, Wh = {
  __name: "progress-bar",
  props: {
    /**
     * The current value represented by the progress bar.
     */
    value: {
      type: Number,
      default: 0
    },
    /**
     * The minimum value of the progress bar, used to determine how much of the
     * bar is filled based on the current value.
     */
    min: {
      type: Number,
      default: 0
    },
    /**
     * The maximum value of the progress bar, used to determine how much of the
     * bar is filled based on the current value.
     */
    max: {
      type: Number,
      default: 100
    },
    /**
     * Whether to show the label to the user.
     */
    showLabel: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to show the value to the user, formatted as a percentage.
     */
    showValue: {
      type: Boolean,
      default: !1
    },
    /**
     * Classes to apply to the track, which is the background behind the bar.
     */
    trackClasses: {
      type: [String, Array, Object],
      default: "h-4 rounded-full bg-grey-200 dark:bg-white/20"
    },
    /**
     * Classes to apply to the bar, which indicates the current value.
     */
    barClasses: {
      type: [String, Array, Object],
      default: "h-full rounded-full bg-purple-800 dark:bg-purple-300"
    },
    // i18n
    /**
     * The label for the progress bar. This label is hidden by default, but is
     * included for accessibility purposes.
     */
    label: {
      type: String,
      default: "Loading…"
    }
  },
  setup(e) {
    const t = e, n = k(() => Ri(t.value, t.min, t.max)), r = k(() => `progress-bar-${ln()}`), o = k(() => t.max <= 0 ? 0 : (n.value - t.min) / t.max), a = k(() => o.value * 100);
    return (s, i) => {
      const l = M("conditional-wrapper");
      return m(), S("div", I({
        "aria-label": e.showLabel ? null : e.label,
        "aria-valuenow": n.value,
        "aria-valuemin": e.min,
        "aria-valuemax": e.max,
        "aria-valuetext": `${a.value}%`,
        "aria-labelledby": e.showLabel ? r.value : null
      }, {
        role: "progressbar",
        "data-test": "progress-bar"
      }), [
        P(l, I({ wrap: e.showLabel || e.showValue, tag: "div" }, { class: "mb-1 flex gap-2" }), {
          default: g(() => [
            e.showLabel ? (m(), S("div", I({ key: 0 }, { id: r.value }, { "data-test": "progress-bar-label" }), [
              b(s.$slots, "default", {}, () => [
                V(ne(e.label), 1)
              ])
            ], 16)) : E("", !0),
            e.showValue ? (m(), S("div", zh, [
              b(s.$slots, "value", H(ee({ value: n.value })), () => [
                V(ne(a.value) + "% ", 1)
              ])
            ])) : E("", !0)
          ]),
          _: 3
        }, 16),
        p("div", {
          class: te(e.trackClasses)
        }, [
          p("div", {
            class: te(["transition-all ease-out", e.barClasses]),
            style: cc({ width: `${a.value}%` })
          }, null, 6)
        ], 2)
      ], 16);
    };
  }
}, Hh = { "data-test": "searchable-list" }, Gh = { class: "flex items-end gap-4" }, Jh = {
  class: "mt-2",
  "data-test": "searchable-list-no-results"
}, Qh = { class: "font-bold" }, Xh = {
  class: "mb-6 mt-2",
  "data-test": "searchable-list-toolbar"
}, Kh = { "data-test": "searchable-list-results" }, ev = {
  __name: "searchable-list",
  props: {
    /**
     * The list of items to search, or display if no search is being performed.
     * This should be an array of objects. Any non-object entries will be
     * ignored.
     */
    data: {
      type: Array,
      required: !0
    },
    /**
     * Any placeholder to provide to the search input. This can be used to
     * indicate the kinds of data the user can search for.
     */
    placeholder: {
      type: String,
      default: null
    },
    /**
     * Any properties to exclude from the search.
     */
    exclude: {
      type: Array,
      default: () => []
    },
    /**
     * Any properties to search exclusively.
     */
    include: {
      type: Array,
      default: () => []
    }
  },
  setup(e, { expose: t }) {
    const n = e, r = Ke("search-field"), o = U(""), a = k(() => F(o.value, { trim: !0 })), s = k(() => L(n.data) ? a.value ? n.data.filter((d) => Vi(d, o.value, {
      exclude: n.exclude,
      include: n.include,
      caseInsensitive: !0,
      allowPartial: !0
    })) : n.data : []), i = k(() => wt(n.data)), l = k(() => wt(s.value)), u = k(() => !a.value || l.value > 0);
    function c() {
      o.value = "", f();
    }
    function f() {
      ae(r.value, "triggerFocus");
    }
    return t({
      resetSearch: c,
      triggerFocus: f
    }), (d, h) => {
      const v = M("form-input"), w = M("ui-button"), y = M("pill-badge");
      return m(), S("div", Hh, [
        p("div", Gh, [
          P(v, I({ ref: "search-field" }, { placeholder: e.placeholder }, {
            modelValue: o.value,
            "onUpdate:modelValue": h[0] || (h[0] = (_) => o.value = _),
            class: "w-full max-w-lg",
            "data-test": "searchable-list-search"
          }), {
            default: g(() => [
              b(d.$slots, "label")
            ]),
            _: 3
          }, 16, ["modelValue"]),
          me(P(w, {
            class: "button--muted",
            "data-test": "searchable-list-reset-search-button",
            onClick: c
          }, {
            default: g(() => [
              b(d.$slots, "reset-search-label", {}, () => [
                h[1] || (h[1] = V(" Reset search "))
              ])
            ]),
            _: 3
          }, 512), [
            [Ie, a.value]
          ])
        ]),
        me(p("div", Jh, [
          b(d.$slots, "no-results", H(ee({ query: o.value })), () => [
            P(y, { class: "text-sm" }, {
              default: g(() => [
                h[2] || (h[2] = V(" Sorry, no results could be found for ")),
                p("span", Qh, '"' + ne(o.value) + '"', 1)
              ]),
              _: 1,
              __: [2]
            })
          ])
        ], 512), [
          [Ie, !u.value]
        ]),
        me(p("div", Xh, [
          b(d.$slots, "results-count", H(ee({ performingSearch: a.value, resultCount: l.value, itemCount: i.value })), () => [
            P(y, null, {
              default: g(() => [
                a.value ? (m(), S(de, { key: 0 }, [
                  V(" Showing " + ne(l.value) + " of " + ne(i.value), 1)
                ], 64)) : (m(), S(de, { key: 1 }, [
                  V(" Showing " + ne(l.value), 1)
                ], 64))
              ]),
              _: 1
            })
          ])
        ], 512), [
          [Ie, u.value]
        ]),
        me(p("div", Kh, [
          b(d.$slots, "default", H(ee({ items: s.value, query: o.value })))
        ], 512), [
          [Ie, u.value]
        ])
      ]);
    };
  }
}, tv = {}, nv = {
  class: "animate-pulse bg-grey-950/10 dark:bg-white/10",
  "data-test": "skeleton-indicator"
};
function rv(e, t) {
  return m(), S("div", nv);
}
const ov = /* @__PURE__ */ B(tv, [["render", rv]]), av = {}, sv = {
  class: "sr-only",
  "aria-live": "polite",
  "data-test": "skeleton-loader"
};
function iv(e, t) {
  return m(), S("div", null, [
    p("div", sv, [
      b(e.$slots, "label")
    ]),
    b(e.$slots, "default")
  ]);
}
const lv = /* @__PURE__ */ B(av, [["render", iv]]), uv = {
  key: 3,
  class: "text-sm ms-1",
  "data-test": "star-rating-current-rating"
}, cv = {
  __name: "star-rating",
  props: /* @__PURE__ */ Re({
    /**
     * Whether to allow the user to choose a rating. If false, this component
     * can just be used to display a current rating, or activated based on some
     * other change, such as an edit.
     */
    readOnly: {
      type: Boolean,
      default: !1
    },
    /**
     * One of `star` or `heart`. Defaults to `star` if the shape is
     * unrecognised.
     */
    shape: {
      type: String,
      default: "star"
    }
  }, {
    modelValue: {
      type: [String, Number]
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = e, r = Me(e, "modelValue"), o = ke(), a = U(null), s = U([1, 2, 3, 4, 5]), i = U([]), l = U(null), u = k(() => ue(o["current-rating"])), c = k(() => n.shape === "heart"), f = k(() => !c.value);
    function d(_) {
      return a.value >= _ && (_ > r.value || !r.value);
    }
    function h(_) {
      return _ <= r.value;
    }
    function v(_) {
      return !d(_) && !h(_);
    }
    function w() {
      if (!L(i.value))
        return;
      const _ = l.value.querySelector(":checked");
      if (_) {
        ae(_, "focus");
        return;
      }
      y();
    }
    function y() {
      const _ = ta(i.value);
      ae(_, "focus");
    }
    return t({
      triggerFocus: w
    }), (_, C) => {
      const $ = M("base-icon"), O = M("form-radio-group");
      return m(), x(O, I({ options: s.value }, {
        "data-test": "star-rating",
        onMouseleave: C[1] || (C[1] = (N) => a.value = null)
      }), {
        options: g(({ options: N, name: j }) => [
          p("div", {
            ref_key: "optionsWrapperElement",
            ref: l,
            class: "mt-1 flex items-center gap-1"
          }, [
            e.readOnly ? c.value ? (m(), x($, {
              key: 1,
              viewBox: "0 0 16 16",
              class: "size-6 text-red-600 fill-red-600"
            }, {
              default: g(() => C[4] || (C[4] = [
                p("path", {
                  stroke: "currentColor",
                  d: "M10.911.5a4.1 4.1 0 0 1 2.897 1.215A4.08 4.08 0 0 1 15 4.612c0 1.867-.718 3.453-1.687 4.748-1.64 2.195-4 3.574-4.977 4.084a1.27 1.27 0 0 1-1.173 0c-.978-.51-3.336-1.89-4.976-4.085C1.218 8.063.5 6.477.5 4.607a4.07 4.07 0 0 1 1.189-2.892A4.09 4.09 0 0 1 4.566.5 4.14 4.14 0 0 1 7.75 2.048 4.12 4.12 0 0 1 10.911.5Z"
                }, null, -1)
              ])),
              _: 1,
              __: [4]
            })) : (m(), x($, {
              key: 2,
              viewBox: "0 0 16 16",
              class: "size-6 text-yellow-600 fill-yellow-600"
            }, {
              default: g(() => C[5] || (C[5] = [
                p("path", {
                  stroke: "currentColor",
                  d: "M8 .5a.3.3 0 0 1 .157.038.16.16 0 0 1 .067.067l2.182 4.423 4.88.709a.25.25 0 0 1 .125.056c.086.204.08.303.012.369l-3.531 3.441.834 4.862a.25.25 0 0 1-.099.243.25.25 0 0 1-.263.02l-4.365-2.296-4.364 2.295a.25.25 0 0 1-.348-.126.25.25 0 0 1-.015-.137l.834-4.86L.574 6.16a.25.25 0 0 1-.062-.256.25.25 0 0 1 .2-.17l4.881-.708L7.776.605a.16.16 0 0 1 .066-.067A.3.3 0 0 1 7.999.5Z"
                }, null, -1)
              ])),
              _: 1,
              __: [5]
            })) : (m(!0), S(de, { key: 0 }, we(N, (R) => (m(), S("div", {
              key: R.id
            }, [
              me(p("input", I({
                ref_for: !0,
                ref_key: "inputReferences",
                ref: i,
                "onUpdate:modelValue": C[0] || (C[0] = (Z) => r.value = Z),
                type: "radio",
                class: "peer sr-only"
              }, { ref_for: !0 }, { id: R.id, value: R.value, name: j }), null, 16), [
                [Ko, r.value]
              ]),
              P(kt, I({ ref_for: !0 }, { id: R.id, styled: !1 }, {
                class: "block cursor-pointer rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-purple-800 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-purple-400 dark:peer-focus-visible:ring-offset-0",
                onMouseover: (Z) => a.value = R.value
              }), {
                default: g(() => [
                  f.value ? (m(), x($, {
                    key: 0,
                    viewBox: "0 0 16 16",
                    class: te(["size-6 transition-colors", {
                      "fill-transparent text-yellow-600": d(R.value),
                      "fill-yellow-600 text-yellow-600 hover:fill-yellow-800 hover:text-yellow-800": h(R.value),
                      "fill-transparent text-grey-300 hover:text-yellow-600": v(R.value)
                    }])
                  }, {
                    default: g(() => [
                      p("title", null, ne(R.value), 1),
                      C[2] || (C[2] = p("path", {
                        stroke: "currentColor",
                        d: "M8 .5a.3.3 0 0 1 .157.038.16.16 0 0 1 .067.067l2.182 4.423 4.88.709a.25.25 0 0 1 .125.056c.086.204.08.303.012.369l-3.531 3.441.834 4.862a.25.25 0 0 1-.099.243.25.25 0 0 1-.263.02l-4.365-2.296-4.364 2.295a.25.25 0 0 1-.348-.126.25.25 0 0 1-.015-.137l.834-4.86L.574 6.16a.25.25 0 0 1-.062-.256.25.25 0 0 1 .2-.17l4.881-.708L7.776.605a.16.16 0 0 1 .066-.067A.3.3 0 0 1 7.999.5Z"
                      }, null, -1))
                    ]),
                    _: 2,
                    __: [2]
                  }, 1032, ["class"])) : E("", !0),
                  c.value ? (m(), x($, {
                    key: 1,
                    viewBox: "0 0 16 16",
                    class: te(["size-6 transition-colors", {
                      "fill-transparent text-red-600": d(R.value),
                      "fill-red-600 text-red-600 hover:fill-red-800 hover:text-red-800": h(R.value),
                      "fill-transparent text-grey-300 hover:text-red-600": v(R.value)
                    }])
                  }, {
                    default: g(() => [
                      p("title", null, ne(R.value), 1),
                      C[3] || (C[3] = p("path", {
                        stroke: "currentColor",
                        d: "M10.911.5a4.1 4.1 0 0 1 2.897 1.215A4.08 4.08 0 0 1 15 4.612c0 1.867-.718 3.453-1.687 4.748-1.64 2.195-4 3.574-4.977 4.084a1.27 1.27 0 0 1-1.173 0c-.978-.51-3.336-1.89-4.976-4.085C1.218 8.063.5 6.477.5 4.607a4.07 4.07 0 0 1 1.189-2.892A4.09 4.09 0 0 1 4.566.5 4.14 4.14 0 0 1 7.75 2.048 4.12 4.12 0 0 1 10.911.5Z"
                      }, null, -1))
                    ]),
                    _: 2,
                    __: [3]
                  }, 1032, ["class"])) : E("", !0)
                ]),
                _: 2
              }, 1040, ["onMouseover"])
            ]))), 128)),
            u.value ? (m(), S("div", uv, [
              b(_.$slots, "current-rating")
            ])) : E("", !0)
          ], 512)
        ]),
        introduction: g(() => [
          b(_.$slots, "introduction")
        ]),
        error: g(() => [
          b(_.$slots, "error")
        ]),
        help: g(() => [
          b(_.$slots, "help")
        ]),
        default: g(() => [
          b(_.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
}, dv = {
  __name: "summary-details",
  props: /* @__PURE__ */ Re({
    /**
     * Whether the details element should initially be open.
     */
    open: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to close the details element when pressing escape. If focus is
     * within this component, focus is moved to the summary element.
     */
    closeWithEscape: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether to close the details element when clicking outside of the
     * component. This is best combined with `floating` for menus.
     */
    closeWithClickOutside: {
      type: Boolean,
      default: !1
    },
    /**
     * The icon to display when the details are open.
     */
    iconOpen: {
      type: String,
      default: "icon-chevron-up"
    },
    /**
     * The icon to display when the details are closed.
     */
    iconClosed: {
      type: String,
      default: "icon-chevron-down"
    },
    /**
     * An override icon, shown both when details are open and closed.
     */
    icon: {
      type: String,
      default: null
    },
    /**
     * Whether to display the icon at the start of the summary, as opposed to
     * the end.
     */
    iconAtStart: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether to include a summary icon at all. This allows more flexibility
     * with the styling of the summary, but it is important to make it clear to
     * the user what is happening.
     */
    includeIcon: {
      type: Boolean,
      default: !0
    },
    /**
     * Whether the details should float when opened, perfect for drop down
     * menus.
     */
    floating: {
      type: Boolean,
      default: !1
    },
    /**
     * When floating, whether to align to the dropdown to the start or end of
     * the summary. This is useful for menus that open to the end of the screen,
     * for example. Anything but "start" will be treated as "end".
     */
    align: {
      type: String,
      default: "start"
    },
    /**
     * Any classes to add to the summary element, allowing styling to wrap both
     * the summary and icons.
     */
    summaryClasses: {
      type: [String, Array, Object],
      default: null
    },
    /**
     * Any classes to add to the details content.
     */
    detailsClasses: {
      type: [String, Array, Object],
      default: "mt-3"
    },
    /**
     * Any classes to add to the icon itself. Particularly useful if the icon is
     * the only visible summary element.
     */
    iconClasses: {
      type: [String, Array, Object],
      default: null
    },
    /**
     * The data-test attribute for this element. This allows us to re-use the
     * provided data-test attribute for sub-components..
     */
    dataTest: {
      type: String,
      default: "summary-details"
    }
  }, {
    modelValue: {
      type: String
    },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Re(["open", "close"], ["update:modelValue"]),
  setup(e, { expose: t, emit: n }) {
    const r = e, o = n, a = Di(), s = Me(e, "modelValue"), i = Ke("detailsElement"), l = Ke("summaryElement"), { focused: u } = Ui(i), c = k(() => F(r.icon) ? r.icon : s.value ? r.iconOpen : r.iconClosed), f = k(() => r.align === "start"), d = k(() => {
      if (!r.floating)
        return;
      const y = a.class ? a.class.split(" ") : [];
      return !y.includes("absolute") && !y.includes("relative") && y.push("relative"), s.value && y.push("z-50"), y;
    });
    ir(() => {
      s.value && i.value.open === !1 && (i.value.open = !0);
    }), Bi("Escape", (y) => {
      y.preventDefault(), !(!s.value || !r.closeWithEscape) && (w(), u.value && l.value.focus());
    }), _d(i, (y) => {
      y.preventDefault(), !(!s.value || !r.closeWithClickOutside) && w();
    });
    function h() {
      s.value = i.value.open;
    }
    function v() {
      i.value.open = !0, h();
    }
    function w() {
      i.value.open = !1, h();
    }
    return _e(s, () => {
      if (s.value) {
        o("open");
        return;
      }
      o("close");
    }), t({
      openDetails: v,
      closeDetails: w
    }), (y, _) => (m(), S("details", I({
      ref_key: "detailsElement",
      ref: i
    }, { "data-test": e.dataTest }, {
      class: d.value,
      onToggle: h
    }), [
      p("summary", I({
        ref_key: "summaryElement",
        ref: l,
        class: ["inline-flex cursor-pointer list-none items-center gap-1", e.summaryClasses]
      }, { "data-test": `${e.dataTest}-summary` }), [
        e.iconAtStart && e.includeIcon ? (m(), x(he(c.value), I({
          key: 0,
          class: e.iconClasses
        }, { "data-test": `${e.dataTest}-icon-start` }), null, 16, ["class"])) : E("", !0),
        b(y.$slots, "summary", H(ee({ isOpen: s.value, icon: c.value }))),
        e.includeIcon && !e.iconAtStart ? (m(), x(he(c.value), I({
          key: 1,
          class: e.iconClasses
        }, { "data-test": `${e.dataTest}-icon-end` }), null, 16, ["class"])) : E("", !0)
      ], 16),
      me(p("div", I({
        class: [{ "absolute top-full animate-fade-in-down": e.floating, "start-0": f.value, "end-0": !f.value }, e.detailsClasses]
      }, { "data-test": `${e.dataTest}-content` }), [
        b(y.$slots, "default", H(ee({ isOpen: s.value, icon: c.value })))
      ], 16), [
        [Ie, s.value]
      ])
    ], 16));
  }
}, fv = { "data-test": "tab-group" }, pv = {
  class: "-mb-px flex flex-wrap items-end",
  role: "tablist"
}, mv = {
  __name: "tab-group",
  props: {
    /**
     * Whether to remember the selected tab, updating the URL and allowing the
     * appropriate tab to be reinstated on load. Note that when using this
     * feature, tabs must be given custom IDs, as opposed to the default IDs,
     * which are randomly generated.
     */
    rememberSelection: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = e, n = U([]), r = k(() => L(n.value) ? n.value.map(($) => ({
      active: C($.tabId),
      ...$
    })) : []), o = U([]), a = U(null), { focused: s } = Ui(a), i = k(() => L(r.value) ? r.value.reduce(($, O) => {
      const N = O == null ? void 0 : O.tabId;
      return F(N) && $.push(N), $;
    }, []) : []), l = U(null), u = k(() => Math.max(0, r.value.findIndex(($) => $.tabId === l.value)));
    Qr("tab-group", {
      registerTab: c,
      activeTabId: l
    }), Bi(["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"], ($) => {
      s.value && ($.preventDefault(), ["ArrowUp", "ArrowLeft"].includes($.key) && v(), ["ArrowDown", "ArrowRight"].includes($.key) && w());
    });
    function c($) {
      if (n.value.find((O) => O.tabId === $.tabId) === void 0) {
        if (n.value.push($), $.initiallyActive === !0) {
          l.value = $.tabId;
          return;
        }
        f();
      }
    }
    function f() {
      F(l.value) && _(l.value) || d(0, { rememberSelection: !1 });
    }
    function d($, { rememberSelection: O = !0 } = {}) {
      var R, Z;
      if (!L(r.value))
        return;
      const N = Ri($, 0, r.value.length - 1), j = (Z = (R = r.value) == null ? void 0 : R[N]) == null ? void 0 : Z.tabId;
      h(j, { rememberSelection: O });
    }
    function h($, { rememberSelection: O = !0 } = {}) {
      _($) && (l.value = $, O === !0 && t.rememberSelection === !0 && window.location.hash.slice(1) !== $ && window.history.pushState(null, null, `#${$}`));
    }
    function v() {
      const $ = Uo(u.value, r.value, { reverse: !0, wrap: !0 });
      d($), y($);
    }
    function w() {
      const $ = Uo(u.value, r.value, { reverse: !1, wrap: !0 });
      d($), y($);
    }
    async function y($) {
      $ < 0 || $ >= o.value.length || (await Xn(), ae(o.value[$], "triggerFocus"));
    }
    function _($) {
      return F($) ? i.value.includes($) : !1;
    }
    function C($) {
      return $ === l.value;
    }
    return ($, O) => {
      const N = M("link-tag");
      return m(), S("div", fv, [
        p("nav", {
          ref_key: "tabBarReference",
          ref: a,
          class: "mb-12 border-b border-grey-200 dark:border-white/20"
        }, [
          p("ol", pv, [
            (m(!0), S(de, null, we(r.value, (j) => (m(), S("li", {
              key: j.tabId
            }, [
              P(N, I({ ref_for: !0 }, {
                id: j.tabId,
                href: `#${j.panelId}`,
                "aria-controls": j.panelId,
                "aria-selected": j.active,
                tabindex: j.active ? "1" : "-1",
                "icon-start": j.icon
              }, {
                ref_for: !0,
                ref_key: "tabAnchors",
                ref: o,
                class: ["inline-block border-b-2 px-4 py-2 no-underline", {
                  "border-purple-800 text-purple-800 dark:border-white dark:text-white": j.active,
                  "border-transparent text-current hocus:border-grey-500 hocus:text-grey-950 dark:hocus:border-white/60 dark:hocus:text-white": !j.active
                }],
                "data-test": "tab-group-tab",
                onClick: Lo((R) => h(j.tabId), ["prevent"])
              }), {
                default: g(() => [
                  (m(), x(he(j.label)))
                ]),
                _: 2
              }, 1040, ["class", "onClick"])
            ]))), 128))
          ])
        ], 512),
        b($.$slots, "default")
      ]);
    };
  }
}, hv = {
  class: "hidden",
  "aria-hidden": "true"
}, vv = {
  __name: "tab-item",
  props: {
    /**
     * Any ID to apply to this tab. This can be used in conjunction with
     * `tab-group` prop `rememberSelection` to reinstate tabs on page refresh.
     * When providing an ID, ensure that it is unique.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Whether this tab is initially active.
     */
    initiallyActive: {
      type: Boolean,
      default: !1
    },
    /**
     * An icon to display with the tab button.
     */
    icon: {
      type: String,
      default: null
    }
  },
  setup(e) {
    const t = e, { registerTab: n, activeTabId: r } = Mn("tab-group"), o = ke(), a = k(() => r.value === i.value), s = k(() => o.label), i = k(() => F(t.id) ? t.id : `tab-${ln()}`), l = k(() => `${i.value}-panel`);
    return ir(() => {
      n({
        initiallyActive: t.initiallyActive,
        label: s,
        tabId: i,
        panelId: l,
        icon: t.icon
      }, a);
      const u = window.location.hash.slice(1);
      F(u) && (u === i.value || document.querySelector(`[id="${l.value}"]  #${u}`)) && (r.value = i.value);
    }), (u, c) => me((m(), S("div", I({ id: l.value, "aria-labelledby": i.value }, { role: "tabpanel" }), [
      p("div", hv, [
        b(u.$slots, "label")
      ]),
      b(u.$slots, "default")
    ], 16)), [
      [Ie, a.value]
    ]);
  }
}, gv = {
  key: 1,
  class: "absolute inset-0 flex items-center justify-center",
  "data-test": "ui-button-loading"
}, yv = { class: "sr-only" }, bv = {
  __name: "ui-button",
  props: {
    /**
     * An icon to display at the start of the button.
     */
    iconStart: {
      type: String,
      default: null
    },
    /**
     * An icon to display at the end of the button.
     */
    iconEnd: {
      type: String,
      default: null
    },
    /**
     * Only display an icon (with "sr-only" text)
     */
    iconOnly: {
      type: Boolean,
      default: !1
    },
    /**
     * Whether this button is "reactive", that is, it will show a loading
     * indicator when activated.
     */
    reactive: {
      type: Boolean,
      default: !1
    },
    /**
     * Any classes to add to the icon itself. If a size class is added
     * (`size-`), the default size class will not be included.
     */
    iconClasses: {
      type: String,
      default: null
    }
  },
  emits: ["click"],
  setup(e, { expose: t, emit: n }) {
    const r = e, o = n, a = U(!1), s = k(() => F(r.iconStart)), i = k(() => F(r.iconEnd)), l = k(() => {
      const d = {};
      return r.reactive && (d["aria-live"] = "polite"), d;
    }), u = k(() => {
      if (!s.value && !i.value)
        return;
      const d = "stroke-current", h = "inline-block align-[0]", v = r.iconOnly ? "size-[1em]" : "size-[0.857em]", w = [d, h, v];
      if (!F(r.iconClasses))
        return a.value ? [...w, "invisible"] : w;
      const y = r.iconClasses.split(" ");
      return y.some((_) => _.includes("stroke-")) || y.push(d), y.some((_) => _.includes("size-")) || y.push(v), a.value && y.push("invisible"), y;
    });
    function c() {
      r.reactive && (a.value = !0), o("click");
    }
    function f() {
      a.value = !1;
    }
    return t({
      reset: f
    }), (d, h) => {
      const v = M("conditional-wrapper"), w = M("icon-loading");
      return m(), S("button", I({
        type: "button",
        class: ["inline-flex items-center", { relative: e.reactive }]
      }, l.value, {
        "data-test": "ui-button",
        onClick: c
      }), [
        s.value ? (m(), x(he(e.iconStart), {
          key: 0,
          class: te([u.value, { "me-2": !e.iconOnly }]),
          "data-test": "ui-button-icon-start"
        }, null, 8, ["class"])) : E("", !0),
        P(v, I({ wrap: e.reactive || e.iconOnly, tag: "span" }, {
          class: { invisible: a.value, "sr-only": e.iconOnly },
          "data-test": "ui-button-label"
        }), {
          default: g(() => [
            b(d.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"]),
        e.reactive ? me((m(), S("span", gv, [
          P(w, { class: "stroke-current animate-spin" }),
          p("span", yv, [
            b(d.$slots, "loading-label", {}, () => [
              h[0] || (h[0] = V(" Loading "))
            ])
          ])
        ], 512)), [
          [Ie, a.value]
        ]) : E("", !0),
        i.value ? (m(), x(he(e.iconEnd), {
          key: 2,
          class: te([u.value, { "ms-2": !e.iconOnly }]),
          "data-test": "ui-button-icon-end"
        }, null, 8, ["class"])) : E("", !0)
      ], 16);
    };
  }
}, _v = {
  __name: "user-avatars",
  props: {
    /**
     * The list of users to display. By default, the format of provided users
     * should include a name, initials, and absolute path to the user's avatar
     * image.
     *
     * Any of the information can be omitted, and the component will do its best
     * to compensate.
     *
     * - If no name is provided, the tooltip will show the initials.
     * - If no initials are provided, they will be generated from the name.
     * - If no avatar is provided, the initials will be shown.
     * - Without a name or initials, no tooltip is included.
     */
    users: {
      type: Array,
      default: () => []
    },
    /**
     * The maximum number of avatars to display. Any additional will contribute
     * to a "+X" last item.
     */
    limit: {
      type: [Number, null],
      default: null
    },
    /**
     * The shape of avatars to display. Available values include "round",
     * "square", and "squircle" (or "roundangle"). Anything else will default to
     * "round".
     */
    shape: {
      type: String,
      default: "round"
    },
    /**
     * The size of the avatars to display, based on Tailwind size classes.
     */
    size: {
      type: String,
      default: "size-10"
    },
    /**
     * Whether avatars should overlap. If they do, they're given an outline so
     * that the images don't clash.
     *
     * Overlap is true by default for "circle" avatars, and false by default for
     * "square" and "squircle", but a value provided here will take precedence.
     */
    overlap: {
      type: Boolean,
      default: null
    },
    /**
     * The colour classes to apply when displaying initials.
     */
    initialsColourClasses: {
      type: String,
      default: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    },
    /**
     * The colour classes to apply when displaying initials.
     */
    initialsOutlineClasses: {
      type: String,
      default: "outline-white dark:outline-purple-200"
    }
  },
  setup(e) {
    const t = e, n = k(() => L(t.users) ? t.users.reduce((d, h) => {
      if (pe(t.limit) && d.length >= t.limit)
        return d;
      const v = c(h);
      return v && (v.showAvatar = v.hasAvatar && !u.value.includes(h.avatar), d.push(v)), d;
    }, []) : []), r = k(() => L(n.value)), o = k(() => pe(t.limit) ? wt(t.users) - t.limit : 0), a = k(() => o.value > 0), s = k(() => t.overlap === !0 || !["square", "squircle"].includes(t.shape) && t.overlap === null), i = k(() => {
      switch (t.shape) {
        case "square":
          return "";
        case "squircle":
        case "roundangle":
          return "rounded-lg";
        default:
          return "rounded-full";
      }
    }), l = k(() => {
      if (!s.value)
        return null;
      const d = "-ms-2 outline-3";
      return F(t.initialsOutlineClasses) ? `${d} ${t.initialsOutlineClasses}` : d;
    }), u = U([]);
    function c(d) {
      if (!oe(d))
        return null;
      const h = F(d.avatar), v = F(d.name), w = F(d.initials);
      if (!h && !v && !w)
        return null;
      const y = {
        ...d,
        hasAvatar: h
      };
      return v && !w && (y.initials = d.name.split(" ").map((_) => _[0]).join("").toUpperCase()), Object.hasOwn(y, "tooltip") || (v ? y.tooltip = y.name : w && (y.tooltip = y.initials)), y.hasInitials = F(y.initials), y;
    }
    function f(d) {
      u.value.push(d);
    }
    return (d, h) => {
      const v = M("image-tag");
      return r.value ? (m(), S("ul", {
        key: 0,
        class: te(["flex items-center gap-1", { "ms-2": s.value }]),
        "data-test": "user-avatars"
      }, [
        (m(!0), S(de, null, we(n.value, (w, y) => (m(), S("li", {
          key: y,
          class: te([i.value, l.value]),
          "data-test": "user-avatars-user"
        }, [
          w.showAvatar ? (m(), x(v, I({
            key: 0,
            ref_for: !0
          }, { src: w.avatar, alt: w.tooltip, title: w.tooltip }, {
            class: ["object-cover", [e.size, i.value]],
            "data-test": "user-avatars-avatar",
            onError: (_) => f(w.avatar)
          }), null, 16, ["class", "onError"])) : w.hasInitials ? (m(), S("div", I({
            key: 1,
            ref_for: !0
          }, { title: w.tooltip }, {
            class: ["flex items-center justify-center text-sm font-bold", [e.size, i.value, e.initialsColourClasses]]
          }), ne(w.initials), 17)) : E("", !0)
        ], 2))), 128)),
        a.value ? (m(), S("li", {
          key: 0,
          class: te([i.value, l.value])
        }, [
          p("div", {
            class: te(["flex items-center justify-center text-sm font-bold", [e.size, i.value, e.initialsColourClasses]])
          }, " +" + ne(o.value), 3)
        ], 2)) : E("", !0)
      ], 2)) : E("", !0);
    };
  }
}, wv = {
  __name: "base-icon",
  props: {
    /**
     * The viewbox for the icon.
     */
    viewBox: {
      type: String,
      default: "0 0 18 18"
    }
  },
  setup(e) {
    return (t, n) => (m(), S("svg", I({ xmlns: "http://www.w3.org/2000/svg" }, { viewBox: e.viewBox }, { role: "presentation" }), [
      b(t.$slots, "default")
    ], 16));
  }
}, kv = {};
function $v(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        p("line", {
          x1: "9.015",
          x2: "9.015",
          y1: "2.813",
          y2: "15.188"
        }),
        p("polyline", { points: "3.938 10.125 9 15.188 14.063 10.125" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Cv = /* @__PURE__ */ B(kv, [["render", $v]]), xv = {};
function Mv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        p("line", {
          x1: "15.188",
          x2: "2.813",
          y1: "9.015",
          y2: "9.015"
        }),
        p("polyline", { points: "7.875 3.938 2.813 9 7.875 14.063" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Sv = /* @__PURE__ */ B(xv, [["render", Mv]]), Iv = {};
function Ov(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        p("line", {
          x1: "2.813",
          x2: "15.188",
          y1: "9.015",
          y2: "9.015"
        }),
        p("polyline", { points: "10.125 3.938 15.188 9 10.125 14.063" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Ev = /* @__PURE__ */ B(Iv, [["render", Ov]]), Dv = {};
function Tv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        p("line", {
          x1: "9.015",
          x2: "9.015",
          y1: "15.188",
          y2: "2.813"
        }),
        p("polyline", { points: "3.938 7.875 9 2.813 14.063 7.875" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Nv = /* @__PURE__ */ B(Dv, [["render", Tv]]), jv = {};
function Rv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", { fill: "none" }, [
        p("path", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M15.75 13.25a2 2 0 0 1-2-2V6.5A4.75 4.75 0 0 0 9 1.75h0A4.75 4.75 0 0 0 4.25 6.5v4.75a2 2 0 0 1-2 2z"
        }),
        p("path", {
          fill: "currentColor",
          d: "M10.588 15.185A.5.5 0 0 0 10.2 15H7.801a.5.5 0 0 0-.489.603C7.485 16.425 8.18 17 9.001 17s1.516-.575 1.689-1.397a.5.5 0 0 0-.101-.418z"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Fv = /* @__PURE__ */ B(jv, [["render", Rv]]), Vv = {};
function Av(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "m13.474 7.25-.374 7.105a2 2 0 0 1-1.997 1.895H6.898a2 2 0 0 1-1.997-1.895L4.527 7.25M2.75 4.75h12.5M6.75 4.75v-2a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1v2" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Pv = /* @__PURE__ */ B(Vv, [["render", Av]]), Bv = {};
function Lv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M1.75 7.25h14.5" }),
        p("rect", {
          width: "14.5",
          height: "10.5",
          x: "1.75",
          y: "3.75",
          rx: "2",
          transform: "rotate(180 9 9)"
        }),
        p("path", { d: "M4.25 11.25h3M12.75 11.25h1" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Uv = /* @__PURE__ */ B(Bv, [["render", Lv]]), Zv = {};
function Yv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "m3 9.5 4 5L15.5 4"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const qv = /* @__PURE__ */ B(Zv, [["render", Yv]]), zv = {};
function Wv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "9",
          cy: "9",
          r: "7.5"
        }),
        p("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M6 9.5 8.25 12l4.25-5.5"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Hv = /* @__PURE__ */ B(zv, [["render", Wv]]), Gv = {};
function Jv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "m15.5 6-6.25 6.25L3 6"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Qv = /* @__PURE__ */ B(Gv, [["render", Jv]]), Xv = {};
function Kv(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "9",
          cy: "9",
          r: "8.25"
        }),
        p("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "m12 8-3 3-3-3"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const eg = /* @__PURE__ */ B(Xv, [["render", Kv]]), tg = {};
function ng(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M12.25 15.5 6 9.25 12.25 3"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const rg = /* @__PURE__ */ B(tg, [["render", ng]]), og = {};
function ag(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "9",
          cy: "9",
          r: "8.25"
        }),
        p("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M10 12 7 9l3-3"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const sg = /* @__PURE__ */ B(og, [["render", ag]]), ig = {};
function lg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "m6 3 6.25 6.25L6 15.5"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const ug = /* @__PURE__ */ B(ig, [["render", lg]]), cg = {};
function dg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "9",
          cy: "9",
          r: "8.25"
        }),
        p("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "m8 12 3-3-3-3"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const fg = /* @__PURE__ */ B(cg, [["render", dg]]), pg = {};
function mg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M3 12.25 9.25 6l6.25 6.25"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const hg = /* @__PURE__ */ B(pg, [["render", mg]]), vg = {};
function gg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "9",
          cy: "9",
          r: "8.25"
        }),
        p("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M12 10 9 7l-3 3"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const yg = /* @__PURE__ */ B(vg, [["render", gg]]), bg = {};
function _g(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M6.25 2.75h-1a2 2 0 0 0-2 2v9.5a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2v-9.5a2 2 0 0 0-2-2h-1" }),
        p("rect", {
          width: "5.5",
          height: "3",
          x: "6.25",
          y: "1.25",
          rx: "1"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const wg = /* @__PURE__ */ B(bg, [["render", _g]]), kg = {};
function $g(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        "stroke-width": "1.5",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        p("line", {
          x1: "14.5",
          x2: "16.5",
          y1: "2",
          y2: "4"
        }),
        p("line", {
          x1: "3.5",
          x2: "1.5",
          y1: "2",
          y2: "4"
        }),
        p("path", { d: "M9,15.75 C12.4518,15.75 15.25,12.9518 15.25,9.5 C15.25,6.04822 12.4518,3.25 9,3.25 C5.54822,3.25 2.75,6.04822 2.75,9.5 C2.75,12.9518 5.54822,15.75 9,15.75 Z" }),
        p("line", {
          x1: "4.581",
          x2: "2.75",
          y1: "13.919",
          y2: "15.75"
        }),
        p("line", {
          x1: "13.419",
          x2: "15.25",
          y1: "13.919",
          y2: "15.75"
        }),
        p("polyline", { points: "9 6.25 9 9.5 11.75 11.25" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Cg = /* @__PURE__ */ B(kg, [["render", $g]]), xg = {};
function Mg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", { fill: "none" }, [
        p("path", {
          fill: "none",
          d: "M12.6,2.7 L5.4,2.7 C3.9087,2.7 2.7,3.9087 2.7,5.4 L2.7,7.2 L15.3,7.2 L15.3,5.4 C15.3,3.9087 14.0913,2.7 12.6,2.7 Z M5.4,5.4 C4.9032,5.4 4.5,4.9968 4.5,4.5 C4.5,4.0032 4.9032,3.6 5.4,3.6 C5.8968,3.6 6.3,4.0032 6.3,4.5 C6.3,4.9968 5.8968,5.4 5.4,5.4 Z M8.1,5.4 C7.6032,5.4 7.2,4.9968 7.2,4.5 C7.2,4.0032 7.6032,3.6 8.1,3.6 C8.5968,3.6 9,4.0032 9,4.5 C9,4.9968 8.5968,5.4 8.1,5.4 Z"
        }),
        p("polyline", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          points: "11.25 10.8 9 13.05 11.25 15.3"
        }),
        p("path", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M15.3,7.9605 L15.3,5.4 C15.3,3.9087 14.0913,2.7 12.6,2.7 L5.4,2.7 C3.9087,2.7 2.7,3.9087 2.7,5.4 L2.7,12.6 C2.7,14.0913 3.9087,15.3 5.4,15.3 L6.795,15.3 L6.7725,15.2775"
        }),
        p("polyline", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          points: "13.95 15.3 16.2 13.05 13.95 10.8"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Sg = /* @__PURE__ */ B(xg, [["render", Mg]]), Ig = {};
function Og(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M14 4 4 14M4 4l10 10" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Eg = /* @__PURE__ */ B(Ig, [["render", Og]]), Dg = {};
function Tg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd"
      }, [
        p("path", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M9.015 9.563V5.625"
        }),
        p("path", {
          stroke: "currentColor",
          "stroke-width": "1.5",
          d: "M11.563 2.25H6.437c-.15 0-.292.06-.398.165L2.415 6.039a.56.56 0 0 0-.165.398v5.126c0 .15.06.292.165.398l3.624 3.624a.56.56 0 0 0 .398.165h5.126c.15 0 .292-.06.398-.165l3.624-3.624a.56.56 0 0 0 .165-.398V6.437c0-.15-.06-.292-.165-.398l-3.624-3.624a.56.56 0 0 0-.398-.165Z"
        }),
        p("circle", {
          cx: "9",
          cy: "12.094",
          r: "1",
          fill: "currentColor",
          "fill-rule": "nonzero"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Ng = /* @__PURE__ */ B(Dg, [["render", Tg]]), jg = {};
function Rg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "4",
          cy: "6",
          r: "2"
        }),
        p("circle", {
          cx: "4",
          cy: "12",
          r: "2"
        }),
        p("path", { d: "M9 6h7.5M9 12h7.5" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Fg = /* @__PURE__ */ B(jg, [["render", Rg]]), Vg = {};
function Ag(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "4",
          cy: "4.5",
          r: "2"
        }),
        p("circle", {
          cx: "4",
          cy: "13.5",
          r: "2"
        }),
        p("path", { d: "M9 4.5h7.5M9 13.5h7.5" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Pg = /* @__PURE__ */ B(Vg, [["render", Ag]]), Bg = {};
function Lg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "4",
          cy: "5",
          r: "2"
        }),
        p("circle", {
          cx: "4",
          cy: "12.5",
          r: "2"
        }),
        p("path", { d: "M9 5h7.5M9 12.5h7.5" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Ug = /* @__PURE__ */ B(Bg, [["render", Lg]]), Zg = {};
function Yg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M5.75 6.75h2M5.75 9.75h6.5M5.75 12.75h6.5M2.75 14.25V3.75a2 2 0 0 1 2-2h5.586c.265 0 .52.105.707.293l3.914 3.914a1 1 0 0 1 .293.707v7.586a2 2 0 0 1-2 2h-8.5a2 2 0 0 1-2-2" }),
        p("path", { d: "M15.16 6.25h-3.41a1 1 0 0 1-1-1V1.852" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const qg = /* @__PURE__ */ B(Zg, [["render", Yg]]), zg = {};
function Wg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M12 6.75 9.25 9.5 6.5 6.75M9.25 9.5V2" }),
        p("path", { d: "M12.25 2h2.25a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2.25M6 15.5a10.8 10.8 0 0 1 6.5 0M9.25 12.5V15" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Hg = /* @__PURE__ */ B(zg, [["render", Wg]]), Gg = {};
function Jg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "m2 5.5 6.767 3.733a1 1 0 0 0 .966 0L16.5 5.5" }),
        p("rect", {
          width: "14.5",
          height: "11.5",
          x: "2",
          y: "3",
          rx: "2",
          transform: "rotate(180 9.25 8.75)"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Qg = /* @__PURE__ */ B(Gg, [["render", Jg]]), Xg = {};
function Kg(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M8.3 9.7 16 2M10.4 2H16v5.6M6.9 3.4H3.4A1.4 1.4 0 0 0 2 4.8v9.8A1.4 1.4 0 0 0 3.4 16h9.8a1.4 1.4 0 0 0 1.4-1.4v-3.5"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const ey = /* @__PURE__ */ B(Xg, [["render", Kg]]), ty = {};
function ny(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M2 9.231a9.97 9.97 0 0 1 7.141-3 9.97 9.97 0 0 1 7.141 3" }),
        p("circle", {
          cx: "9.141",
          cy: "11.731",
          r: "2.75"
        }),
        p("path", { d: "M4.162 7.559 2.891 5.481M7.441 6.375 6.964 4M14.12 7.559l1.271-2.078M10.841 6.375 11.318 4" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const ry = /* @__PURE__ */ B(ty, [["render", ny]]), oy = {};
function ay(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("line", {
          x1: "9",
          x2: "9",
          y1: "6.5",
          y2: "11.5"
        }),
        p("line", {
          x1: "2",
          x2: "16",
          y1: "6.5",
          y2: "6.5"
        }),
        p("line", {
          x1: "2",
          x2: "16",
          y1: "11.5",
          y2: "11.5"
        }),
        p("line", {
          x1: "9",
          x2: "9",
          y1: "11.5",
          y2: "15"
        }),
        p("line", {
          x1: "9",
          x2: "9",
          y1: "3",
          y2: "6.5"
        }),
        p("line", {
          x1: "5.379",
          x2: "5.379",
          y1: "3",
          y2: "6.5"
        }),
        p("line", {
          x1: "12.621",
          x2: "12.621",
          y1: "3",
          y2: "6.5"
        }),
        p("line", {
          x1: "5.379",
          x2: "5.379",
          y1: "11.5",
          y2: "15"
        }),
        p("line", {
          x1: "12.621",
          x2: "12.621",
          y1: "11.5",
          y2: "15"
        }),
        p("rect", {
          width: "14",
          height: "12",
          x: "2",
          y: "3",
          rx: "2",
          transform: "rotate(180 9 9)"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const sy = /* @__PURE__ */ B(oy, [["render", ay]]), iy = {};
function ly(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M5.063 9.015h7.875M3.938 15.188h2.059a2.25 2.25 0 0 0 2.214-1.848L9.79 4.66a2.25 2.25 0 0 1 2.214-1.848h2.06" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const uy = /* @__PURE__ */ B(iy, [["render", ly]]), cy = {};
function dy(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", {
          stroke: "currentColor",
          d: "m6.837 12.493 5.206-5.2a1 1 0 0 1 1.414 0l3.043 3.043"
        }),
        p("path", {
          stroke: "currentColor",
          d: "M2 7v6.5a2 2 0 0 0 2 2h8.5"
        }),
        p("rect", {
          width: "11.5",
          height: "9.5",
          x: "5",
          y: "3",
          stroke: "currentColor",
          rx: "2",
          transform: "rotate(180 10.75 7.75)"
        }),
        p("path", {
          fill: "currentColor",
          "fill-rule": "nonzero",
          d: "M8.25 7.25c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const fy = /* @__PURE__ */ B(cy, [["render", dy]]), py = {};
function my(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        p("circle", {
          cx: "9.25",
          cy: "9.25",
          r: "7.25",
          stroke: "currentColor",
          "stroke-width": "1.5"
        }),
        p("path", {
          stroke: "currentColor",
          "stroke-width": "1.5",
          d: "M9.25 13.069V8.5"
        }),
        p("path", {
          fill: "currentColor",
          "fill-rule": "nonzero",
          d: "M9.25 7a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const hy = /* @__PURE__ */ B(py, [["render", my]]), vy = {};
function gy(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M4.5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2M1 15h16.5" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const yy = /* @__PURE__ */ B(vy, [["render", gy]]), by = {};
function _y(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M9.25 1v1M15.084 3.416l-.707.707M17.5 9.25h-1M3.416 3.416l.707.707M1 9.25h1M14 9.25a4.755 4.755 0 0 0-5.777-4.642C6.351 5 4.873 6.565 4.565 8.452A4.745 4.745 0 0 0 7.5 13.657V16a1 1 0 0 0 1 1H10a1 1 0 0 0 1-1v-2.343a4.74 4.74 0 0 0 3-4.407M7.147 13.5h4.206" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const wy = /* @__PURE__ */ B(by, [["render", _y]]), ky = {};
function $y(e, t) {
  const n = M("base-icon");
  return m(), x(n, { class: "animate-spin" }, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M11.813 2.813A6.82 6.82 0 0 1 15.75 9a6.75 6.75 0 1 1-13.5 0 6.82 6.82 0 0 1 3.938-6.187"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Cy = /* @__PURE__ */ B(ky, [["render", $y]]), xy = {};
function My(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", { fill: "none" }, [
        p("path", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M8.805,10.75 L9.787,15.397 C9.901,15.937 9.556,16.468 9.015,16.582 L8.037,16.789 C7.497,16.903 6.966,16.558 6.852,16.017 L5.75,10.75"
        }),
        p("path", {
          fill: "currentColor",
          d: "M16.185,5.912 C16.068,6.007 16,6.149 16,6.3 L16,8.699 C16,8.85 16.068,8.992 16.185,9.087 C16.302,9.182 16.456,9.219 16.603,9.188 C17.425,9.015 18,8.32 18,7.499 C18,6.678 17.425,5.983 16.603,5.81 C16.456,5.779 16.302,5.816 16.185,5.911 L16.185,5.912 Z"
        }),
        p("path", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M14.25,13.25 C14.25,13.25 12.313,10.75 10,10.75 C7.688,10.75 5,10.75 5,10.75 C3.205,10.75 1.75,9.295 1.75,7.5 C1.75,5.705 3.205,4.25 5,4.25 L10,4.25 C12.312,4.25 14.25,1.75 14.25,1.75 L14.25,13.25 Z"
        }),
        p("line", {
          x1: "5.75",
          x2: "5.75",
          y1: "4.25",
          y2: "10.75",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Sy = /* @__PURE__ */ B(xy, [["render", My]]), Iy = {};
function Oy(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M14.64 8.438V5.063M16.313 6.765h-3.375M11.265 2.25V4.5M12.375 3.39h-2.25M14.814 11.122a6.756 6.756 0 0 1-7.936-7.936 6.187 6.187 0 1 0 7.936 7.936" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Ey = /* @__PURE__ */ B(Iy, [["render", Oy]]), Dy = {};
function Ty(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M6.625 2.8125C2.125 2.8125 6.625 9 2.125 9 6.625 9 2.125 15.1875 6.625 15.1875M11.375 2.8125C15.875 2.8125 11.375 9 15.875 9 11.375 9 15.875 15.1875 11.375 15.1875"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Ny = /* @__PURE__ */ B(Dy, [["render", Ty]]), jy = {};
function Ry(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M5.75 8.25V5A3.25 3.25 0 0 1 9 1.75h0A3.25 3.25 0 0 1 12.25 5v3.25M9 11.75v1" }),
        p("rect", {
          width: "11.5",
          height: "8",
          x: "3.25",
          y: "8.25",
          rx: "2"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Fy = /* @__PURE__ */ B(jy, [["render", Ry]]), Vy = {};
function Ay(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.5"
      }, [
        p("path", {
          "stroke-linecap": "square",
          d: "M1.5 15.75h15"
        }),
        p("path", { d: "m9.75 3 3 3" }),
        p("path", {
          "stroke-linecap": "square",
          d: "M6.75 12 3 12.75 3.75 9l6.876-6.876a2.12 2.12 0 0 1 3 0h0a2.12 2.12 0 0 1 0 3z"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Py = /* @__PURE__ */ B(Vy, [["render", Ay]]), By = {};
function Ly(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("path", { d: "M9 16.25v-4M14.25 12.25a7.6 7.6 0 0 0-.969-2.875A7.5 7.5 0 0 0 12.25 8V3.75a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-2 2V8a7.4 7.4 0 0 0-1.031 1.375 7.6 7.6 0 0 0-.969 2.875z" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Uy = /* @__PURE__ */ B(By, [["render", Ly]]), Zy = {};
function Yy(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("line", {
          x1: "8.75",
          x2: "8.75",
          y1: "3",
          y2: "14.5"
        }),
        p("line", {
          x1: "3",
          x2: "14.5",
          y1: "8.75",
          y2: "8.75"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const qy = /* @__PURE__ */ B(Zy, [["render", Yy]]), zy = {};
function Wy(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M1.872 2.555 2.28 5.5l2.944-.407"
      }, null, -1),
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M16.232 7.734A7.25 7.25 0 0 0 2.29 5.5"
      }, null, -1),
      p("g", {
        fill: "currentColor",
        stroke: "none"
      }, [
        p("circle", {
          cx: "14.127",
          cy: "13.377",
          r: "1"
        }),
        p("circle", {
          cx: "9",
          cy: "15.5",
          r: "1"
        }),
        p("circle", {
          cx: "3.873",
          cy: "13.377",
          r: "1"
        }),
        p("circle", {
          cx: "1.75",
          cy: "8.25",
          r: "1"
        }),
        p("circle", {
          cx: "15.698",
          cy: "11.024",
          r: "1"
        }),
        p("circle", {
          cx: "11.774",
          cy: "14.948",
          r: "1"
        }),
        p("circle", {
          cx: "6.226",
          cy: "14.948",
          r: "1"
        }),
        p("circle", {
          cx: "2.302",
          cy: "11.024",
          r: "1"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Hy = /* @__PURE__ */ B(zy, [["render", Wy]]), Gy = {};
function Jy(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", { fill: "none" }, [
        p("rect", {
          width: "12.375",
          height: "2.813",
          x: "2.813",
          y: "8.438",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          rx: ".563"
        }),
        p("rect", {
          width: "12.375",
          height: "2.813",
          x: "2.813",
          y: "3.375",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          rx: ".563"
        }),
        p("line", {
          x1: "7.313",
          x2: "10.688",
          y1: "15.202",
          y2: "15.202",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5"
        }),
        p("line", {
          x1: "9.015",
          x2: "9.015",
          y1: "13.5",
          y2: "16.875",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const Qy = /* @__PURE__ */ B(Gy, [["render", Jy]]), Xy = {};
function Ky(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M7.313 8.925a4.5 4.5 0 0 1 5.625-6.348l-2.813 3.048.398 1.852 1.852.398 3.048-2.812a4.5 4.5 0 0 1-6.348 5.625l-3.942 4.57a1.69 1.69 0 0 1-2.39-2.39z"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const eb = /* @__PURE__ */ B(Xy, [["render", Ky]]), tb = {};
function nb(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("path", {
        fill: "none",
        "fill-rule": "evenodd",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
        d: "M14.625 14.077H3.375M4.64 11.25a4.5 4.5 0 1 1 8.72 0M16.875 11.265H1.125M5.625 2.813l.563 1.125M1.688 6.75l1.125.563M16.313 6.75l-1.125.563M12.375 2.813l-.562 1.125"
      }, null, -1)
    ])),
    _: 1,
    __: [0]
  });
}
const rb = /* @__PURE__ */ B(tb, [["render", nb]]), ob = {};
function ab(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }, [
        p("circle", {
          cx: "5.552",
          cy: "6.5",
          r: "2"
        }),
        p("path", { d: "M9.41 15.372c.524-.175.83-.744.637-1.259a4.802 4.802 0 0 0-8.988 0c-.194.516.113 1.085.636 1.259a12.183 12.183 0 0 0 7.717 0z" }),
        p("circle", {
          cx: "11.802",
          cy: "4",
          r: "2"
        }),
        p("path", { d: "M12.55 13.477a12.2 12.2 0 0 0 3.11-.605c.523-.175.83-.744.636-1.259a4.802 4.802 0 0 0-7.137-2.319" })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const sb = /* @__PURE__ */ B(ob, [["render", ab]]), ib = {};
function lb(e, t) {
  const n = M("base-icon");
  return m(), x(n, null, {
    default: g(() => t[0] || (t[0] = [
      p("g", {
        fill: "none",
        "fill-rule": "evenodd"
      }, [
        p("path", {
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "m7.638 3.786-5.425 9.396a1.573 1.573 0 0 0 1.362 2.359h10.85a1.573 1.573 0 0 0 1.362-2.359l-5.425-9.396a1.573 1.573 0 0 0-2.724 0M9 6.791v3.5"
        }),
        p("path", {
          fill: "currentColor",
          "fill-rule": "nonzero",
          d: "M9 13.86a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2"
        })
      ], -1)
    ])),
    _: 1,
    __: [0]
  });
}
const ub = /* @__PURE__ */ B(ib, [["render", lb]]), cb = {
  AccordionGroup: vc,
  AccordionPanel: xc,
  AlertMessage: Oc,
  AppPagination: Bc,
  BaseIcon: wv,
  BreadcrumbItem: Uc,
  BreadcrumbList: qc,
  ButtonGroup: Wc,
  ConditionalWrapper: Gc,
  CopyContent: Xc,
  DataTable: Kd,
  DisplayDate: n0,
  DonutChart: s0,
  DropdownMenu: u0,
  DropdownMenuButton: c0,
  DropdownMenuCheckbox: d0,
  DropdownMenuDivider: h0,
  DropdownMenuLink: v0,
  DropdownMenuTitle: g0,
  FloatingDetails: y0,
  FormActions: w0,
  FormCheckbox: T0,
  FormCheckboxGroup: N0,
  FormDate: F0,
  FormField: U0,
  FormFieldset: q0,
  FormInput: eh,
  FormInputGroup: nh,
  FormLayout: sh,
  FormRadioGroup: ih,
  FormSelect: ch,
  FormTextarea: dh,
  FormWrapper: hh,
  IconArrowDown: Cv,
  IconArrowLeft: Sv,
  IconArrowRight: Ev,
  IconArrowUp: Nv,
  IconBell: Fv,
  IconBin: Pv,
  IconCard: Uv,
  IconCheck: qv,
  IconCheckCircled: Hv,
  IconChevronDown: Qv,
  IconChevronDownCircled: eg,
  IconChevronLeft: rg,
  IconChevronLeftCircled: sg,
  IconChevronRight: ug,
  IconChevronRightCircled: fg,
  IconChevronUp: hg,
  IconChevronUpCircled: yg,
  IconClipboard: wg,
  IconClock: Cg,
  IconCode: Sg,
  IconCross: Eg,
  IconDanger: Ng,
  IconDensityCompact: Fg,
  IconDensityRelaxed: Pg,
  IconDensityStandard: Ug,
  IconDocument: qg,
  IconDownload: Hg,
  IconEmail: Qg,
  IconExternal: ey,
  IconEye: ry,
  IconFilm: sy,
  IconFunction: uy,
  IconImage: fy,
  IconInfo: hy,
  IconLaptop: yy,
  IconLightbulb: wy,
  IconLoading: Cy,
  IconMegaphone: Sy,
  IconMoon: Ey,
  IconObject: Ny,
  IconPadlock: Fy,
  IconPencil: Py,
  IconPin: Uy,
  IconPlus: qy,
  IconReload: Hy,
  IconSlot: Qy,
  IconSpanner: eb,
  IconSun: rb,
  IconUser: sb,
  IconWarning: ub,
  ImageTag: gh,
  LinkTag: yh,
  LoadingIndicator: bh,
  ModalDialog: kh,
  NotificationHandler: Zh,
  PillBadge: qh,
  ProgressBar: Wh,
  SearchableList: ev,
  SkeletonIndicator: ov,
  SkeletonLoader: lv,
  StarRating: cv,
  SummaryDetails: dv,
  TabGroup: mv,
  TabItem: vv,
  UiButton: bv,
  UserAvatars: _v
}, Mi = cb, gb = {
  install(e) {
    Object.keys(Mi).forEach((t) => {
      e.component(t, Mi[t]);
    });
  }
};
export {
  gb as default
};
