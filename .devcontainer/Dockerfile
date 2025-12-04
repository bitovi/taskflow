FROM --platform=linux/amd64 node:24-slim

# Install dependencies for Playwright, Prisma, and development tools
RUN apt-get update && apt-get install -y \
    # Prisma dependencies
    openssl \
    ca-certificates \
    # Playwright browser dependencies
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libxshmfence1 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxext6 \
    # GTK3 and related dependencies (required by Playwright)
    libxcursor1 \
    libgtk-3-0 \
    libgdk-pixbuf-2.0-0 \
    libpangocairo-1.0-0 \
    libcairo-gobject2 \
    # Fonts and rendering
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-unifont \
    # Additional utilities
    wget \
    git \
    procps \
    # For native Node.js addons (bcryptjs, etc.)
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/${localWorkspaceFolderBasename}