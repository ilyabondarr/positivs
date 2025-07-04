# 🚀 Webpack Конфигурация - Шпаргалка

## 📦 Обновленные пакеты в package.json

### 🔄 Замененные пакеты:
- `node-sass` → `sass` - современная реализация Sass
- `optimize-css-assets-webpack-plugin` → `css-minimizer-webpack-plugin` - актуальная минификация CSS
- `imagemin-webpack` → `image-minimizer-webpack-plugin` - современная оптимизация изображений

### ➕ Добавленные пакеты для верстки:
- `autoprefixer` - автоматические вендорные префиксы
- `postcss` + `postcss-loader` - обработка CSS
- `stylelint` + конфиги - проверка качества CSS/SCSS
- `style-loader` - горячая перезагрузка стилей в dev режиме
- `ttf2woff` + `ttf2woff2` - конвертация шрифтов

### 🎯 Новые скрипты:
```bash
npm run lint:css        # Проверка CSS/SCSS кода
npm run lint:css:fix    # Автоматическое исправление CSS/SCSS
npm run fonts:convert   # Конвертация TTF → WOFF/WOFF2
```

## 🎨 Конвертация шрифтов

### Как использовать:
1. **Поместите TTF файлы** в папку `src/assets/fonts/ttf/`
2. **Запустите конвертацию:**
   ```bash
   npm run fonts:convert
   ```
3. **Получите результат:**
   - WOFF/WOFF2 файлы в `src/assets/fonts/converted/`
   - Автоматически созданный `_fonts.scss` с @font-face правилами

### Пример работы:
```bash
npm run fonts:convert

🎨 Конвертация шрифтов TTF → WOFF/WOFF2

📋 Найдено 2 TTF файлов для конвертации:

✅ Roboto-Regular: TTF → WOFF, WOFF2
   📊 Размеры: TTF(168.5 KB) → WOFF(89.2 KB) → WOFF2(67.8 KB)
   💾 Экономия: 100.7 KB (60%)

✅ OpenSans-Bold: TTF → WOFF, WOFF2
   📊 Размеры: TTF(245.3 KB) → WOFF(132.1 KB) → WOFF2(98.4 KB)
   💾 Экономия: 146.9 KB (60%)

📊 ИТОГОВАЯ СТАТИСТИКА:
✅ Успешно конвертировано: 2 из 2 файлов
💾 Общая экономия: 247.6 KB (60%)
📁 Конвертированные файлы сохранены в: src/assets/fonts/converted
📝 Создан файл с @font-face правилами: src/assets/fonts/_fonts.scss
```

### Использование конвертированных шрифтов:
```scss
// В вашем основном SCSS файле
@import '@fonts/fonts';

// Или используйте классы напрямую
.custom-text {
    font-family: 'Roboto-Regular', sans-serif;
}

// Или используйте автоматически созданные классы
.font-roboto-regular {
    // Стили уже применены
}
```

## ⚙️ Конфигурационные файлы

### postcss.config.js
```javascript
module.exports = {
  plugins: [
    require('autoprefixer')  // Автоматические префиксы для браузеров
  ]
};
```

### .stylelintrc.json
```json
{
  "extends": [
    "stylelint-config-standard",        // Базовые правила CSS
    "stylelint-config-standard-scss"    // Правила для SCSS
  ],
  "rules": {
    "selector-class-pattern": null,     // Отключить проверку имен классов
    "no-descending-specificity": null,  // Отключить проверку специфичности
    "scss/at-import-partial-extension": null,
    "scss/dollar-variable-pattern": null
  }
}
```

## 🔧 Основные изменения в webpack.config.js

### 1. **Оптимизация разделения кода (splitChunks)**
```javascript
cacheGroups: {
    vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
    }
}
```
**Зачем:** Отделяет библиотеки от вашего кода для лучшего кэширования

### 2. **Улучшенная минификация HTML**
```javascript
minify: isProd ? {
    collapseWhitespace: true,      // Убрать лишние пробелы
    removeComments: true,          // Убрать комментарии
    removeRedundantAttributes: true, // Убрать лишние атрибуты
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true          // Использовать короткий DOCTYPE
} : false
```

### 3. **Умная обработка стилей**
```javascript
// Для CSS
use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // Горячая перезагрузка в dev
    'css-loader',
    'postcss-loader'  // Автопрефиксы
]

// Для SCSS
use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',  // Автопрефиксы
    'sass-loader'
]
```

### 4. **Расширенная поддержка файлов**
```javascript
// Изображения (включая WebP)
test: /\.(jpg|png|svg|jpeg|gif|webp)$/

// Все форматы шрифтов
test: /\.(woff|woff2|eot|ttf|otf)$/
```

### 5. **Алиасы путей (удобные импорты)**
```javascript
resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@styles': path.resolve(__dirname, 'src/assets/style'),
        '@images': path.resolve(__dirname, 'src/assets/images'),
        '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
        '@fonts-converted': path.resolve(__dirname, 'src/assets/fonts/converted')
    }
}
```

**Использование:**
```scss
// Вместо: @import '../../../assets/style/vars';
@import '@styles/vars';

// Вместо: background-image: url('../../../assets/images/logo.png');
background-image: url('@images/logo.png');

// Конвертированные шрифты
@import '@fonts/fonts';
```

### 6. **Улучшенный devtool**
```javascript
devtool: isDev ? 'eval-source-map' : false
```
**Зачем:** Быстрая компиляция в dev режиме, отключение в production

### 7. **Улучшенный devServer**
```javascript
devServer: {
    watchFiles: ['src/**/*'],  // Следить за всеми файлами
    // ... остальные настройки
}
```

## 🎨 Browserslist (поддержка браузеров)

```json
"browserslist": [
    "> 1%",           // Браузеры с долей > 1%
    "last 2 versions", // Последние 2 версии каждого браузера
    "not dead"        // Исключить мертвые браузеры
]
```

## 🚀 Команды для работы

### Разработка:
```bash
npm start          # Запуск dev сервера
npm run dev        # Сборка в dev режиме
```

### Продакшн:
```bash
npm run build      # Сборка для продакшна
npm run clear      # Очистка папки dist
```

### Качество кода:
```bash
npm run lint:css        # Проверить CSS/SCSS
npm run lint:css:fix    # Исправить CSS/SCSS автоматически
```

### Шрифты:
```bash
npm run fonts:convert   # Конвертировать TTF → WOFF/WOFF2
```

## 💡 Полезные советы

### 1. **Импорты стилей**
```javascript
// В JS файле
import '@styles/style.scss';
import '@styles/vars.scss';
```

### 2. **Импорты изображений**
```javascript
// В JS файле
import logo from '@images/logo.png';
```

### 3. **Импорты шрифтов**
```scss
// В SCSS файле - автоматически создается
@import '@fonts/fonts';

// Или вручную
@font-face {
    font-family: 'MyFont';
    src: url('@fonts-converted/myfont.woff2') format('woff2'),
         url('@fonts-converted/myfont.woff') format('woff');
    font-display: swap;
}
```

### 4. **Автопрефиксы работают автоматически**
```scss
// Пишите современный CSS
.example {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

// Автопрефиксы добавятся автоматически:
// -ms-grid-columns: repeat(auto-fit, minmax(200px, 1fr));
// grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

### 5. **Работа с шрифтами**
```scss
// Структура папок:
src/assets/fonts/
├── ttf/              # Поместите сюда TTF файлы
├── converted/        # Автоматически создается
│   ├── font1.woff
│   ├── font1.woff2
│   ├── font2.woff
│   └── font2.woff2
└── _fonts.scss       // Автоматически создается
```

## 🔍 Отладка

### Если что-то не работает:
1. Проверьте консоль на ошибки
2. Убедитесь, что все пакеты установлены: `npm install`
3. Очистите кэш: `npm run clear`
4. Проверьте синтаксис SCSS: `npm run lint:css`

### Частые проблемы:
- **Ошибка sass-loader**: Проверьте версии `sass` и `sass-loader`
- **Не работают автопрефиксы**: Проверьте `postcss.config.js`
- **Не обновляются стили**: Убедитесь, что используется `style-loader` в dev режиме
- **Шрифты не конвертируются**: Проверьте, что TTF файлы находятся в `src/assets/fonts/ttf/`

---
*Последнее обновление: $(date)* 

git pull --rebase origin main
git push origin main
