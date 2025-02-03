Get-Content tree_filtered.txt | 
    Select-String -NotMatch "node_modules" | 
    Select-String -NotMatch ".git" |
    Select-String -NotMatch ".bin" |
    Select-String -NotMatch "pnpm-store" | # Ajuste conforme necessário
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*node_modules.*" | # Remove linhas dentro de node_modules
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*pnpm-store.*" | # Remove linhas dentro de pnpm-store
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*.pnpm-cache.*" | # Remove linhas dentro de .pnpm-cache
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.pnpm-store.*" | # Remove linhas dentro de .pnpm-store
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*.cache.*" | # Remove linhas dentro de .cache
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.yarn.*" | # Remove linhas dentro de .yarn
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*bower_components.*" | # Remove linhas dentro de bower_components
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.npm-global.*" | # Remove linhas dentro de .npm-global
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.config/yarn.*" | # Remove linhas dentro de .config/yarn
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/Cypress.*" | # Remove linhas dentro de .cache/Cypress
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/ms-playwright.*" | # Remove linhas dentro de .cache/ms-playwright
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/selenium.*" | # Remove linhas dentro de .cache/selenium
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/pip.*" | # Remove linhas dentro de .cache/pip
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/pypoetry.*" | # Remove linhas dentro de .cache/pypoetry
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/pnpm.*" | # Remove linhas dentro de .cache/pnpm
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/webdriver-manager.*" | # Remove linhas dentro de .cache/webdriver-manager
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/yarn.*" | # Remove linhas dentro de .cache/yarn
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/share/pnpm.*" | # Remove linhas dentro de .local/share/pnpm
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/share/pypoetry.*" | # Remove linhas dentro de .local/share/pypoetry
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/share/virtualenvs.*" | # Remove linhas dentro de .local/share/virtualenvs
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/lib/python.*" | # Remove linhas dentro de .local/lib/python
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/bin.*" | # Remove linhas dentro de .local/bin
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/include.*" | # Remove linhas dentro de .local/include
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.local/share/jupyter.*" | # Remove linhas dentro de .local/share/jupyter
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.config/pip.*" | # Remove linhas dentro de .config/pip
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.config/pypoetry.*" | # Remove linhas dentro de .config/pypoetry
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.config/yarn.*" | # Remove linhas dentro de .config/yarn
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.config/npm.*" | # Remove linhas dentro de .config/npm
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.config/bower.*" | # Remove linhas dentro de .config/bower
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/bower.*" | # Remove linhas dentro de .cache/bower
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/node-gyp.*" | # Remove linhas dentro de .cache/node-gyp
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/npx.*" | # Remove linhas dentro de .cache/npx
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/_*.*" | # Remove linhas dentro de .cache/_*
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/eslint.*" | # Remove linhas dentro de .cache/eslint
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/prettier.*" | # Remove linhas dentro de .cache/prettier
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/stylelint.*" | # Remove linhas dentro de .cache/stylelint
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/ts-node.*" | # Remove linhas dentro de .cache/ts-node
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/v8-compile-cache.*" | # Remove linhas dentro de .cache/v8-compile-cache
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/webpack.*" | # Remove linhas dentro de .cache/webpack
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/yarn/v*.*" | # Remove linhas dentro de .cache/yarn/v*
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/yarn/__virtual__.*" | # Remove linhas dentro de .cache/yarn/__virtual__
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.cache/yarn/berry.*" | # Remove linhas dentro de .cache/yarn/berry
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.npmrc.*" | # Remove linhas dentro de .npmrc
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.nvmrc.*" | # Remove linhas dentro de .nvmrc
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.editorconfig.*" | # Remove linhas dentro de .editorconfig
    Select-String -NotMatch "^\s*[^A-Za-z]:\\.*\.gitignore.*" | # Remove linhas dentro de .gitignore
    Select-String -NotMatch "^\s*[^ ]+@.*" | # Remove linhas que parecem ser de dependências (ex: "pacote@1.2.3")
    Select-String -NotMatch "^\s*\(.*\)" | # Remove linhas que parecem ser de dependências (ex: "(dependência opcional)")
    Select-String -NotMatch "^\s*[a-f0-9]{32,}$" | # Remove linhas que parecem ser hashes de arquivos (comum em dependências)
    Where-Object { $_ -notmatch "^[A-Z]:\\.*" } | # Remove a linha inicial com o caminho completo
    Where-Object { $_ -notmatch "^Folder PATH listing.*" } | # Remove a linha de cabeçalho
    Where-Object { $_ -notmatch "^Volume serial number.*" } | # Remove a linha com o número de série do volume
    Out-File -Encoding UTF8 tree_filtered2.txt # Salva o resultado em um arquivo .txt com codificação UTF8

Remove-Item tree_output.txt # Remove o arquivo temporário