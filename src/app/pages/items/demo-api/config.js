// In real applications, you should not transpile code in the browser.
// You can see how to create your own application with Angular and DevExtreme here:
// https://js.devexpress.com/Documentation/Guide/Angular_Components/Getting_Started/Create_a_DevExtreme_Application/
window.config = {
    transpiler: 'ts',
    typescriptOptions: {
        module: 'system',
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
    },
    meta: {
        'typescript': {
            'exports': 'ts',
        },
        'devextreme-aspnet-data-nojquery': {
            'esModule': true,
        },
        'devextreme/localization.js': {
            'esModule': true,
        },
    },
    paths: {
        'npm:': 'https://unpkg.com/',
    },
    map: {
        'ts': 'npm:plugin-typescript@8.0.0/lib/plugin.js',
        'typescript': 'npm:typescript@3.5.3/lib/typescript.js',
        '@angular/core': 'npm:@angular/core@12.2.13',
        '@angular/platform-browser': 'npm:@angular/platform-browser@12.2.13',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@12.2.13',
        '@angular/forms': 'npm:@angular/forms@12.2.13',
        '@angular/common': 'npm:@angular/common@12.2.13',
        '@angular/compiler': 'npm:@angular/compiler@12.2.13',
        'tslib': 'npm:tslib@2.3.1/tslib.js',
        'rxjs': 'npm:rxjs@6.4.0',
        'devextreme-aspnet-data-nojquery': 'npm:devextreme-aspnet-data-nojquery@2.8.4/index.js',
        'rrule': 'npm:rrule@2.6.6/dist/es5/rrule.js',
        'luxon': 'npm:luxon@1.28.0/build/global/luxon.min.js',
        'es6-object-assign': 'npm:es6-object-assign@1.1.0',
        'devextreme': 'npm:devextreme@21.2.4/cjs',
        'devextreme/bundles/dx.all': 'npm:devextreme@21.2.4/bundles/dx.all.js',
        'jszip': 'npm:jszip@3.7.1/dist/jszip.min.js',
        'devextreme-quill': 'npm:devextreme-quill@1.5.7/dist/dx-quill.min.js',
        'devexpress-diagram': 'npm:devexpress-diagram@2.1.40',
        'devexpress-gantt': 'npm:devexpress-gantt@4.0.0',
        'devextreme-angular': 'npm:devextreme-angular@21.2.4',
        '@devextreme/runtime': 'npm:@devextreme/runtime@2.3.13',
        'inferno': 'npm:inferno@7.4.11/dist/inferno.min.js',
        'inferno-compat': 'npm:inferno-compat@7.4.11/dist/inferno-compat.min.js',
        'inferno-create-element': 'npm:inferno-create-element@7.4.11/dist/inferno-create-element.min.js',
        'inferno-dom': 'npm:inferno-dom/dist/inferno-dom.min.js',
        'inferno-hydrate': 'npm:inferno-hydrate@7.4.11/dist/inferno-hydrate.min.js',
        'inferno-clone-vnode': 'npm:inferno-clone-vnode@7.4.11/dist/inferno-clone-vnode.min.js',
        'inferno-create-class': 'npm:inferno-create-class@7.4.11/dist/inferno-create-class.min.js',
        'inferno-extras': 'npm:inferno-extras@7.4.11/dist/inferno-extras.min.js',
    },
    packages: {
        'app': {
            main: './app.component.ts',
            defaultExtension: 'ts',
        },
        'devextreme': {
            defaultExtension: 'js',
        },
        'devextreme/events/utils': {
            main: 'index',
        },
        'devextreme/events': {
            main: 'index',
        },
        'es6-object-assign': {
            main: './index.js',
            defaultExtension: 'js',
        },
    },
    packageConfigPaths: [
        'npm:@devextreme/*/package.json',
        'npm:@devextreme/runtime@2.3.13/inferno/package.json',
        'npm:@angular/*/package.json',
        'npm:@angular/common@12.2.13/*/package.json',
        'npm:rxjs@6.4.0/package.json',
        'npm:rxjs@6.4.0/operators/package.json',
        'npm:devextreme-angular@21.2.4/*/package.json',
        'npm:devextreme-angular@21.2.4/ui/*/package.json',
        'npm:devextreme-angular@21.2.4/package.json',
        'npm:devexpress-diagram@2.1.40/package.json',
        'npm:devexpress-gantt@4.0.0/package.json',
    ],
};
System.config(window.config);