# Modelo Entidad-Relación: RepairIT (Multi-Sucursal & Normalizado)

Este diagrama representa el modelo de datos de la base de datos de **RepairIT**, estructurado de forma normalizada (3NF) para evitar redundancias de clientes y permitir la gestión multi-sucursal y multi-inquilino.

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ VENUES : "posee"
    ORGANIZATIONS ||--o{ USERS : "tiene personal"
    ORGANIZATIONS ||--o{ CLIENTS : "registra"
    
    VENUES ||--o{ VENUE_USERS : "asigna a"
    USERS ||--o{ VENUE_USERS : "trabaja en"
    
    VENUES ||--o{ CLIENTS : "registra en sucursal"
    CLIENTS ||--o{ ORDERS : "crea"
    VENUES ||--o{ ORDERS : "procesa en"
    
    VENUES ||--o{ INVENTORY : "posee"
    ORDERS ||--o{ ORDER_INVENTORY : "consume"
    INVENTORY ||--o{ ORDER_INVENTORY : "es consumido por"

    ORGANIZATIONS {
        uuid id PK
        string name
        string subscription_plan
        string subscription_status
        timestamp created_at
    }

    VENUES {
        uuid id PK
        uuid organization_id FK
        string name
        string email
        string phone
        string address
        timestamp created_at
    }

    USERS {
        uuid id PK
        uuid organization_id FK
        string name
        string email UK
        string password_hash
        string role
        timestamp created_at
    }

    VENUE_USERS {
        uuid id PK
        uuid venue_id FK
        uuid user_id FK
        timestamp created_at
    }

    CLIENTS {
        uuid id PK
        uuid organization_id FK
        uuid venue_id FK
        string name
        string dni UK
        string email
        string phone
        timestamp created_at
        timestamp updated_at
    }

    ORDERS {
        uuid id PK
        uuid venue_id FK
        uuid client_id FK
        string tracking_code UK
        string device_type
        string device_brand_model
        string device_serial
        text reported_fault
        string status
        decimal budget_amount
        boolean budget_approved
        timestamp budget_approved_at
        timestamp created_at
        timestamp updated_at
    }

    INVENTORY {
        uuid id PK
        uuid venue_id FK
        string name
        text description
        integer quantity
        integer min_quantity
        decimal price
        timestamp created_at
    }

    ORDER_INVENTORY {
        uuid id PK
        uuid order_id FK
        uuid inventory_id FK
        integer quantity_used
        decimal unit_price_at_use
        timestamp created_at
    }
```
