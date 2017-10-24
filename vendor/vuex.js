/**
 * vuex v3.0.0
 * (c) 2017 Evan You
 * @license MIT
 */
!(function(t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd ? define(e) : (t.Vuex = e())
})(this, function() {
  'use strict'
  function t(t) {
    $ &&
      ((t._devtoolHook = $),
      $.emit('vuex:init', t),
      $.on('vuex:travel-to-state', function(e) {
        t.replaceState(e)
      }),
      t.subscribe(function(t, e) {
        $.emit('vuex:mutation', t, e)
      }))
  }
  function e(t, e) {
    Object.keys(t).forEach(function(n) {
      return e(t[n], n)
    })
  }
  function n(t) {
    return null !== t && 'object' == typeof t
  }
  function o(t) {
    return t && 'function' == typeof t.then
  }
  function i(t, e, n) {
    if ((e.update(n), n.modules))
      for (var o in n.modules) {
        if (!e.getChild(o)) return
        i(t.concat(o), e.getChild(o), n.modules[o])
      }
  }
  function r(t, e) {
    return (
      e.indexOf(t) < 0 && e.push(t),
      function() {
        var n = e.indexOf(t)
        n > -1 && e.splice(n, 1)
      }
    )
  }
  function s(t, e) {
    ;(t._actions = Object.create(null)),
      (t._mutations = Object.create(null)),
      (t._wrappedGetters = Object.create(null)),
      (t._modulesNamespaceMap = Object.create(null))
    var n = t.state
    a(t, n, [], t._modules.root, !0), c(t, n, e)
  }
  function c(t, n, o) {
    var i = t._vm
    t.getters = {}
    var r = {}
    e(t._wrappedGetters, function(e, n) {
      ;(r[n] = function() {
        return e(t)
      }),
        Object.defineProperty(t.getters, n, {
          get: function() {
            return t._vm[n]
          },
          enumerable: !0,
        })
    })
    var s = j.config.silent
    ;(j.config.silent = !0),
      (t._vm = new j({ data: { $$state: n }, computed: r })),
      (j.config.silent = s),
      t.strict && d(t),
      i &&
        (o &&
          t._withCommit(function() {
            i._data.$$state = null
          }),
        j.nextTick(function() {
          return i.$destroy()
        }))
  }
  function a(t, e, n, o, i) {
    var r = !n.length,
      s = t._modules.getNamespace(n)
    if ((o.namespaced && (t._modulesNamespaceMap[s] = o), !r && !i)) {
      var c = m(e, n.slice(0, -1)),
        f = n[n.length - 1]
      t._withCommit(function() {
        j.set(c, f, o.state)
      })
    }
    var d = (o.context = u(t, s, n))
    o.forEachMutation(function(e, n) {
      p(t, s + n, e, d)
    }),
      o.forEachAction(function(e, n) {
        var o = e.root ? n : s + n,
          i = e.handler || e
        h(t, o, i, d)
      }),
      o.forEachGetter(function(e, n) {
        l(t, s + n, e, d)
      }),
      o.forEachChild(function(o, r) {
        a(t, e, n.concat(r), o, i)
      })
  }
  function u(t, e, n) {
    var o = '' === e,
      i = {
        dispatch: o
          ? t.dispatch
          : function(n, o, i) {
              var r = v(n, o, i),
                s = r.payload,
                c = r.options,
                a = r.type
              return (c && c.root) || (a = e + a), t.dispatch(a, s)
            },
        commit: o
          ? t.commit
          : function(n, o, i) {
              var r = v(n, o, i),
                s = r.payload,
                c = r.options,
                a = r.type
              ;(c && c.root) || (a = e + a), t.commit(a, s, c)
            },
      }
    return (
      Object.defineProperties(i, {
        getters: {
          get: o
            ? function() {
                return t.getters
              }
            : function() {
                return f(t, e)
              },
        },
        state: {
          get: function() {
            return m(t.state, n)
          },
        },
      }),
      i
    )
  }
  function f(t, e) {
    var n = {},
      o = e.length
    return (
      Object.keys(t.getters).forEach(function(i) {
        if (i.slice(0, o) === e) {
          var r = i.slice(o)
          Object.defineProperty(n, r, {
            get: function() {
              return t.getters[i]
            },
            enumerable: !0,
          })
        }
      }),
      n
    )
  }
  function p(t, e, n, o) {
    ;(t._mutations[e] || (t._mutations[e] = [])).push(function(e) {
      n.call(t, o.state, e)
    })
  }
  function h(t, e, n, i) {
    ;(t._actions[e] || (t._actions[e] = [])).push(function(e, r) {
      var s = n.call(
        t,
        {
          dispatch: i.dispatch,
          commit: i.commit,
          getters: i.getters,
          state: i.state,
          rootGetters: t.getters,
          rootState: t.state,
        },
        e,
        r,
      )
      return (
        o(s) || (s = Promise.resolve(s)),
        t._devtoolHook
          ? s.catch(function(e) {
              throw (t._devtoolHook.emit('vuex:error', e), e)
            })
          : s
      )
    })
  }
  function l(t, e, n, o) {
    t._wrappedGetters[e] ||
      (t._wrappedGetters[e] = function(t) {
        return n(o.state, o.getters, t.state, t.getters)
      })
  }
  function d(t) {
    t._vm.$watch(
      function() {
        return this._data.$$state
      },
      function() {},
      { deep: !0, sync: !0 },
    )
  }
  function m(t, e) {
    return e.length
      ? e.reduce(function(t, e) {
          return t[e]
        }, t)
      : t
  }
  function v(t, e, o) {
    return (
      n(t) && t.type && ((o = e), (e = t), (t = t.type)),
      { type: t, payload: e, options: o }
    )
  }
  function _(t) {
    ;(j && t === j) || w((j = t))
  }
  function y(t) {
    return Array.isArray(t)
      ? t.map(function(t) {
          return { key: t, val: t }
        })
      : Object.keys(t).map(function(e) {
          return { key: e, val: t[e] }
        })
  }
  function g(t) {
    return function(e, n) {
      return (
        'string' != typeof e
          ? ((n = e), (e = ''))
          : '/' !== e.charAt(e.length - 1) && (e += '/'),
        t(e, n)
      )
    }
  }
  function b(t, e, n) {
    var o = t._modulesNamespaceMap[n]
    return o
  }
  var w = function(t) {
      function e() {
        var t = this.$options
        t.store
          ? (this.$store = 'function' == typeof t.store ? t.store() : t.store)
          : t.parent && t.parent.$store && (this.$store = t.parent.$store)
      }
      if (Number(t.version.split('.')[0]) >= 2) t.mixin({ beforeCreate: e })
      else {
        var n = t.prototype._init
        t.prototype._init = function(t) {
          void 0 === t && (t = {}),
            (t.init = t.init ? [e].concat(t.init) : e),
            n.call(this, t)
        }
      }
    },
    $ = 'undefined' != typeof window && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
    M = function(t, e) {
      ;(this.runtime = e),
        (this._children = Object.create(null)),
        (this._rawModule = t)
      var n = t.state
      this.state = ('function' == typeof n ? n() : n) || {}
    },
    O = { namespaced: { configurable: !0 } }
  ;(O.namespaced.get = function() {
    return !!this._rawModule.namespaced
  }),
    (M.prototype.addChild = function(t, e) {
      this._children[t] = e
    }),
    (M.prototype.removeChild = function(t) {
      delete this._children[t]
    }),
    (M.prototype.getChild = function(t) {
      return this._children[t]
    }),
    (M.prototype.update = function(t) {
      ;(this._rawModule.namespaced = t.namespaced),
        t.actions && (this._rawModule.actions = t.actions),
        t.mutations && (this._rawModule.mutations = t.mutations),
        t.getters && (this._rawModule.getters = t.getters)
    }),
    (M.prototype.forEachChild = function(t) {
      e(this._children, t)
    }),
    (M.prototype.forEachGetter = function(t) {
      this._rawModule.getters && e(this._rawModule.getters, t)
    }),
    (M.prototype.forEachAction = function(t) {
      this._rawModule.actions && e(this._rawModule.actions, t)
    }),
    (M.prototype.forEachMutation = function(t) {
      this._rawModule.mutations && e(this._rawModule.mutations, t)
    }),
    Object.defineProperties(M.prototype, O)
  var E = function(t) {
    this.register([], t, !1)
  }
  ;(E.prototype.get = function(t) {
    return t.reduce(function(t, e) {
      return t.getChild(e)
    }, this.root)
  }),
    (E.prototype.getNamespace = function(t) {
      var e = this.root
      return t.reduce(function(t, n) {
        return (e = e.getChild(n)), t + (e.namespaced ? n + '/' : '')
      }, '')
    }),
    (E.prototype.update = function(t) {
      i([], this.root, t)
    }),
    (E.prototype.register = function(t, n, o) {
      var i = this
      void 0 === o && (o = !0)
      var r = new M(n, o)
      0 === t.length
        ? (this.root = r)
        : this.get(t.slice(0, -1)).addChild(t[t.length - 1], r),
        n.modules &&
          e(n.modules, function(e, n) {
            i.register(t.concat(n), e, o)
          })
    }),
    (E.prototype.unregister = function(t) {
      var e = this.get(t.slice(0, -1)),
        n = t[t.length - 1]
      e.getChild(n).runtime && e.removeChild(n)
    })
  var j,
    C = function(e) {
      var n = this
      void 0 === e && (e = {}),
        !j && 'undefined' != typeof window && window.Vue && _(window.Vue)
      var o = e.plugins
      void 0 === o && (o = [])
      var i = e.strict
      void 0 === i && (i = !1)
      var r = e.state
      void 0 === r && (r = {}),
        'function' == typeof r && (r = r() || {}),
        (this._committing = !1),
        (this._actions = Object.create(null)),
        (this._actionSubscribers = []),
        (this._mutations = Object.create(null)),
        (this._wrappedGetters = Object.create(null)),
        (this._modules = new E(e)),
        (this._modulesNamespaceMap = Object.create(null)),
        (this._subscribers = []),
        (this._watcherVM = new j())
      var s = this,
        u = this,
        f = u.dispatch,
        p = u.commit
      ;(this.dispatch = function(t, e) {
        return f.call(s, t, e)
      }),
        (this.commit = function(t, e, n) {
          return p.call(s, t, e, n)
        }),
        (this.strict = i),
        a(this, r, [], this._modules.root),
        c(this, r),
        o.forEach(function(t) {
          return t(n)
        }),
        j.config.devtools && t(this)
    },
    x = { state: { configurable: !0 } }
  ;(x.state.get = function() {
    return this._vm._data.$$state
  }),
    (x.state.set = function(t) {}),
    (C.prototype.commit = function(t, e, n) {
      var o = this,
        i = v(t, e, n),
        r = i.type,
        s = i.payload,
        c = (i.options, { type: r, payload: s }),
        a = this._mutations[r]
      a &&
        (this._withCommit(function() {
          a.forEach(function(t) {
            t(s)
          })
        }),
        this._subscribers.forEach(function(t) {
          return t(c, o.state)
        }))
    }),
    (C.prototype.dispatch = function(t, e) {
      var n = this,
        o = v(t, e),
        i = o.type,
        r = o.payload,
        s = { type: i, payload: r },
        c = this._actions[i]
      if (c)
        return (
          this._actionSubscribers.forEach(function(t) {
            return t(s, n.state)
          }),
          c.length > 1
            ? Promise.all(
                c.map(function(t) {
                  return t(r)
                }),
              )
            : c[0](r)
        )
    }),
    (C.prototype.subscribe = function(t) {
      return r(t, this._subscribers)
    }),
    (C.prototype.subscribeAction = function(t) {
      return r(t, this._actionSubscribers)
    }),
    (C.prototype.watch = function(t, e, n) {
      var o = this
      return this._watcherVM.$watch(
        function() {
          return t(o.state, o.getters)
        },
        e,
        n,
      )
    }),
    (C.prototype.replaceState = function(t) {
      var e = this
      this._withCommit(function() {
        e._vm._data.$$state = t
      })
    }),
    (C.prototype.registerModule = function(t, e, n) {
      void 0 === n && (n = {}),
        'string' == typeof t && (t = [t]),
        this._modules.register(t, e),
        a(this, this.state, t, this._modules.get(t), n.preserveState),
        c(this, this.state)
    }),
    (C.prototype.unregisterModule = function(t) {
      var e = this
      'string' == typeof t && (t = [t]),
        this._modules.unregister(t),
        this._withCommit(function() {
          var n = m(e.state, t.slice(0, -1))
          j.delete(n, t[t.length - 1])
        }),
        s(this)
    }),
    (C.prototype.hotUpdate = function(t) {
      this._modules.update(t), s(this, !0)
    }),
    (C.prototype._withCommit = function(t) {
      var e = this._committing
      ;(this._committing = !0), t(), (this._committing = e)
    }),
    Object.defineProperties(C.prototype, x)
  var k = g(function(t, e) {
      var n = {}
      return (
        y(e).forEach(function(e) {
          var o = e.key,
            i = e.val
          ;(n[o] = function() {
            var e = this.$store.state,
              n = this.$store.getters
            if (t) {
              var o = b(this.$store, 0, t)
              if (!o) return
              ;(e = o.context.state), (n = o.context.getters)
            }
            return 'function' == typeof i ? i.call(this, e, n) : e[i]
          }),
            (n[o].vuex = !0)
        }),
        n
      )
    }),
    G = g(function(t, e) {
      var n = {}
      return (
        y(e).forEach(function(e) {
          var o = e.key,
            i = e.val
          n[o] = function() {
            for (var e = [], n = arguments.length; n--; ) e[n] = arguments[n]
            var o = this.$store.commit
            if (t) {
              var r = b(this.$store, 0, t)
              if (!r) return
              o = r.context.commit
            }
            return 'function' == typeof i
              ? i.apply(this, [o].concat(e))
              : o.apply(this.$store, [i].concat(e))
          }
        }),
        n
      )
    }),
    S = g(function(t, e) {
      var n = {}
      return (
        y(e).forEach(function(e) {
          var o = e.key,
            i = e.val
          ;(i = t + i),
            (n[o] = function() {
              if (!t || b(this.$store, 0, t)) return this.$store.getters[i]
            }),
            (n[o].vuex = !0)
        }),
        n
      )
    }),
    A = g(function(t, e) {
      var n = {}
      return (
        y(e).forEach(function(e) {
          var o = e.key,
            i = e.val
          n[o] = function() {
            for (var e = [], n = arguments.length; n--; ) e[n] = arguments[n]
            var o = this.$store.dispatch
            if (t) {
              var r = b(this.$store, 0, t)
              if (!r) return
              o = r.context.dispatch
            }
            return 'function' == typeof i
              ? i.apply(this, [o].concat(e))
              : o.apply(this.$store, [i].concat(e))
          }
        }),
        n
      )
    })
  return {
    Store: C,
    install: _,
    version: '3.0.0',
    mapState: k,
    mapMutations: G,
    mapGetters: S,
    mapActions: A,
    createNamespacedHelpers: function(t) {
      return {
        mapState: k.bind(null, t),
        mapGetters: S.bind(null, t),
        mapMutations: G.bind(null, t),
        mapActions: A.bind(null, t),
      }
    },
  }
})
